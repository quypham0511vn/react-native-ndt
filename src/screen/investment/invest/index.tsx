import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, View, ViewStyle } from 'react-native';

import IcBag from '@/assets/image/ic_bag.svg';
import IcBank from '@/assets/image/ic_bank.svg';
import IcNganLuong from '@/assets/image/ic_ngan_luong.svg';
import IcVimo from '@/assets/image/ic_vimo.svg';
import IcCheckBoxOff from '@/assets/image/invest/check_box_off.svg';
import IcCheckBoxOn from '@/assets/image/invest/check_box_on.svg';
import IcNoAccount from '@/assets/image/invest/no_account.svg';
import IcUnConfirmed from '@/assets/image/invest/unconfirmed.svg';
import IcWaitingConfirm from '@/assets/image/invest/waiting_confirm.svg';
import { Configs } from '@/common/Configs';
import { ENUM_METHOD_PAYMENT, STATE_LINK, STATE_VERIFY_ACC } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabsName } from '@/common/screenNames';
import { Button } from '@/components/elements/button';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import ItemInfoContract from '@/components/ItemInfoContract';
import Loading from '@/components/loading';
import PopupConfirmPolicy from '@/components/PopupConfirmPolicy';
import { PopupInvestOTP } from '@/components/popupOTP';
import PopupUpdateInvest, { PopupUpdateInvestActions } from '@/components/popupUpdateInvest';
import { useAppStore } from '@/hooks';
import { BankInformationModel, InvestorInfoModel, PackageInvest } from '@/models/invest';
import { PaymentMethodModel } from '@/models/payment-method-model';
import { PopupActionTypes } from '@/models/typesPopup';
import { InfoLinkVimoModal } from '@/models/user-models';
import Navigator from '@/routers/Navigator';
import { MyStylesInvest } from '@/screen/investment/invest/styles';
import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';
import ToastUtils from '@/utils/ToastUtils';
import { BUTTON_STYLES } from '@/components/elements/button/constants';

const Invest = observer(({ route }: any) => {
    const styles = MyStylesInvest();
    const { apiServices, userManager } = useAppStore();

    const [dataInvestment, setDataInvestment] = useState<PackageInvest>();
    const [methodPayment, setMethodPayment] = useState<string>();
    const [isCheckBox, setIsCheckBox] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [paymentMethodConfig, setPaymentMethodConfig] = useState<PaymentMethodModel>();
    const refModal = useRef<PopupActionTypes>(null);
    const refPopupPolicy = useRef<PopupActionTypes>(null);
    const [statusVimo, setStatusVimo] = useState<boolean>(false);
    const refInvestId = useRef<any>(null);
    const refScreen = useRef<any>(null);
    const refPopupUpdateInvest = useRef<PopupUpdateInvestActions>(null);

    useEffect(() => {
        if (route?.params?.id) {
            refInvestId.current = route?.params?.id;
            refScreen.current = route?.params?.screen;
        }
        if (refInvestId.current) {
            fetchDetailInvestNow();
            fetchData();
        }
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const resPaymentMethod = await apiServices.paymentMethod.getPaymentMethod();
        setIsLoading(false);
        const fetchPaymentMethod = resPaymentMethod.data as PaymentMethodModel;
        setPaymentMethodConfig(fetchPaymentMethod);
        if (resPaymentMethod.success && fetchPaymentMethod.vimo) {
            fetchInfoVimoLink();
        }
    }, [apiServices.paymentMethod]);

    const fetchInfoVimoLink = useCallback(async () => {
        const res = await apiServices.paymentMethod.requestInfoLinkVimo();
        if (res.success) {
            const data = res.data as InfoLinkVimoModal;
            if (data?.trang_thai === STATE_LINK.LINKING) {
                setStatusVimo(true);
            }
        }
    }, [apiServices.paymentMethod]);

    const fetchDetailInvestNow = useCallback(async () => {
        setIsLoading(true);
        const resInvestNow = await apiServices.invest.getDetailInvestNow(refInvestId.current);
        setIsLoading(false);
        if (resInvestNow.success) {
            const res = resInvestNow.data as PackageInvest;
            setDataInvestment(res);
        }
    }, [apiServices.invest]);

    const checkBox = useCallback(() => {
        setIsCheckBox(!isCheckBox);
    }, [isCheckBox]);

    const getOtpVimo = useCallback(async () => {
        const resOtp = await apiServices.invest.getOTP(dataInvestment?.id?.toString() || '');
        if (resOtp.success && resOtp.data) {
            refModal.current?.show();
        }
        // else {
        //     const infor = resOtp?.data as CheckVimoWalletModel;
        //     // Alert.alert(infor.message || Languages.detailInvest.error);
        // }
    }, [apiServices.invest, dataInvestment?.id]);

    const goBack = useCallback(() => {
        if (refInvestId.current) {
            Navigator.resetScreen([ScreenName.account]);
            if (refScreen.current) {
                Navigator.resetScreen([ScreenName.home]);
            } else {
                Navigator.resetScreen([ScreenName.invest]);
            }
        }
    }, []);

    const onNavigateUpdate = useCallback(() => {
        Navigator.navigateToDeepScreen([TabsName.accountTabs], ScreenName.paymentMethod, { goBack, screen: refScreen.current });
    }, [goBack]);

    const onNavigateConfirmed = useCallback(() => {
        Navigator.navigateToDeepScreen([TabsName.accountTabs], ScreenName.accountIdentify, { goBack, screen: refScreen.current });
    }, [goBack]);

    const onInvest = useCallback(async () => {
        //check verify and update bank info before invest
        setIsLoading(true);
        const res = await apiServices.invest.getInfoInvest();
        setIsLoading(false);
        if (res?.success) {
            const data = res.data as InvestorInfoModel;
            if (userManager?.userInfo?.tinh_trang?.status === STATE_VERIFY_ACC.NO_VERIFIED) {
                refPopupUpdateInvest.current?.show(
                    Languages.invest.unconfirmed,
                    Languages.invest.contentUnconfirmed,
                    Languages.account.accuracyNow,
                    onNavigateConfirmed,
                    <IcUnConfirmed />
                );
                return
            } else if (userManager?.userInfo?.tinh_trang?.status === STATE_VERIFY_ACC.WAIT) {
                refPopupUpdateInvest.current?.show(
                    Languages.invest.waitingConfirm,
                    Languages.invest.contentWaitingConfirm,
                    undefined,
                    undefined,
                    <IcWaitingConfirm />
                );
                return
            } else if (data?.tra_lai && !data?.tra_lai?.name_bank_account) {
                refPopupUpdateInvest.current?.show(
                    Languages.invest.noAccount,
                    Languages.invest.contentNoAccount,
                    Languages.invest.updateNow,
                    onNavigateUpdate,
                    <IcNoAccount />
                );
                return
            }
        }

        if (methodPayment === ENUM_METHOD_PAYMENT.BANK) {
            setIsLoading(true);
            const resPayment = await apiServices.invest.getInvestBankInfo(dataInvestment?.id?.toString() || '', Platform.OS);
            setIsLoading(false);

            const bankInfo = resPayment?.data?.bill as BankInformationModel;
            if (resPayment.success && bankInfo.id) {
                Navigator.pushScreen(ScreenName.transferScreen, bankInfo);
            }
        } else if (methodPayment === ENUM_METHOD_PAYMENT.NGAN_LUONG) {
            const resPayment = await apiServices.invest.requestNganLuong(dataInvestment?.id?.toString() || '', Platform.OS);
            if (resPayment.success && resPayment.data) {
                Navigator.pushScreen(ScreenName.paymentWebview, {
                    url: resPayment?.data
                });
            }
        } else if (methodPayment === ENUM_METHOD_PAYMENT.VIMO) {
            getOtpVimo();
        }

        setIsLoading(false);
    }, [apiServices.invest, dataInvestment?.id, getOtpVimo, methodPayment, onNavigateConfirmed, onNavigateUpdate, userManager?.userInfo?.tinh_trang?.status]);

    const openPolicy = useCallback(() => {
        refPopupPolicy.current?.show();
    }, []);

    const onConfirmPopup = useCallback(() => {
        setIsCheckBox(true);
        refPopupPolicy.current?.hide();
    }, []);

    const renderInfoItem = useCallback((label: string, value: string, colorText?: string) => (
        <ItemInfoContract label={label} value={value} colorText={colorText} />
    ), []);

    const renderMethod = useCallback((icon: any, label: string, method: string, linked?: boolean) => {
        const onPress = () => {
            setMethodPayment(method);
        };
        const selected = methodPayment === method;

        const borderColor = {
            borderColor: selected ? COLORS.GREEN : COLORS.GRAY_11
        } as ViewStyle;

        return (
            <Touchable onPress={onPress} style={[styles.wrapItemMethod, borderColor]}
                radius={20}>
                {icon}
                <View style={styles.wrapLabel}>
                    <Text style={styles.txtMethod}>{label}</Text>
                    {linked && <Text style={styles.greenText}>{Languages.detailInvest.linked}</Text>}
                </View>
                <View style={[styles.btSelected, borderColor]}>
                    {selected && < View style={styles.circle} />}
                </View>
            </Touchable>
        );
    }, [methodPayment, styles.btSelected, styles.circle, styles.greenText, styles.txtMethod, styles.wrapItemMethod, styles.wrapLabel]);

    return (
        <View>
            <HeaderBar title={Languages.invest.title} hasBack />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
                style={styles.wrapContent}>
                <View style={styles.wrapIcon}>
                    <IcBag />
                </View>
                <View style={styles.wrapInfo}>
                    <Text style={styles.title}>{Languages.detailInvest.information}</Text>
                    {renderInfoItem(Languages.detailInvest.idContract, `${dataInvestment?.ma_hop_dong}`, COLORS.GREEN)}
                    {renderInfoItem(Languages.detailInvest.moneyInvest, Utils.formatMoney(dataInvestment?.so_tien_dau_tu), COLORS.RED)}
                    {renderInfoItem(Languages.detailInvest.interestYear, `${dataInvestment?.ti_le_lai_suat_hang_nam}`)}
                    {renderInfoItem(Languages.detailInvest.interest, `${dataInvestment?.ti_le_lai_suat_hang_thang}`)}
                    {renderInfoItem(Languages.detailInvest.interestMonth, Utils.formatMoney(dataInvestment?.lai_hang_thang))}
                    {renderInfoItem(Languages.detailInvest.amountInterest, Utils.formatMoney(dataInvestment?.tong_lai_nhan_duoc))}
                    {renderInfoItem(Languages.detailInvest.period, `${dataInvestment?.ki_han_dau_tu}`)}
                    {renderInfoItem(Languages.detailInvest.expectedDate, `${dataInvestment?.ngay_dao_han_du_kien}`)}
                    {renderInfoItem(Languages.detailInvest.formality, `${dataInvestment?.hinh_thuc_tra_lai}`)}
                </View>
                <Text style={styles.labelMoney}>{Languages.detailInvest.money}</Text>
                <Text style={styles.money}>{Utils.formatMoney(dataInvestment?.so_tien_dau_tu)}</Text>
                <Text style={styles.headerText}>{Languages.detailInvest.method}</Text>

                {paymentMethodConfig?.nganluong && renderMethod(<IcNganLuong />, Languages.detailInvest.nganLuong, ENUM_METHOD_PAYMENT.NGAN_LUONG)}
                {paymentMethodConfig?.bank && renderMethod(<IcBank />, Languages.detailInvest.bank, ENUM_METHOD_PAYMENT.BANK)}
                {paymentMethodConfig?.vimo && renderMethod(<IcVimo />, Languages.detailInvest.vimo, ENUM_METHOD_PAYMENT.VIMO, statusVimo)}

                <View style={styles.viewBottom}>
                    <Touchable onPress={checkBox}>
                        {!isCheckBox ? <IcCheckBoxOff width={25} height={25} /> : <IcCheckBoxOn width={25} height={25} />}
                    </Touchable>
                    <Touchable onPress={openPolicy} style={styles.policy}>
                        <Text style={styles.txtCheckBox}>
                            {Languages.detailInvest.agreeTermsWith}
                            <Text style={{
                                color: COLORS.GREEN,
                                fontFamily: Configs.FontFamily.bold
                            }}>{Languages.detailInvest.rules}</Text>
                            {Languages.detailInvest.tienngay}
                        </Text>
                    </Touchable>
                </View>
                <Button
                    buttonStyle={(isCheckBox && methodPayment) ? BUTTON_STYLES.GREEN : BUTTON_STYLES.GRAY}
                    label={Languages.invest.investNow}
                    disabled={!(isCheckBox && methodPayment)}
                    onPress={onInvest}
                />

            </ScrollView>
            <PopupInvestOTP
                idContract={dataInvestment?.id?.toString()}
                getOTPcode={getOtpVimo}
                ref={refModal}
                title={Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(`${userManager.userInfo?.phone_number}`))}
            />
            <PopupConfirmPolicy
                onConfirm={onConfirmPopup}
                ref={refPopupPolicy}
            />
            <PopupUpdateInvest
                ref={refPopupUpdateInvest}
            />
            {isLoading && <Loading isOverview />}
        </View>
    );
});

export default Invest;



