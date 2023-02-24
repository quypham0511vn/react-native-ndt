import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TextStyle, View } from 'react-native';
import Dash from 'react-native-dash';

import IcBag from '@/assets/image/ic_bag.svg';
import { ENUM_INVEST_STATUS, ENUM_STATUS_CONTRACT } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName from '@/common/screenNames';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import ItemInfoContract from '@/components/ItemInfoContract';
import Loading from '@/components/loading';
import { useAppStore } from '@/hooks';
import { HistoryModel, PackageInvest } from '@/models/invest';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';
import styles from './styles';


export const DetailInvestment = observer(({ route }: any) => {

    const { status } = route?.params as any;
    const { id } = route?.params as any;
    const { apiServices } = useAppStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<PackageInvest>();
    const [dataHistory, setDataHistory] = useState<HistoryModel[]>();

    useEffect(() => {
        switch (status) {
            case ENUM_INVEST_STATUS.INVEST_NOW:
                fetchDetailInvestNow();
                break;
            case ENUM_INVEST_STATUS.INVESTING:
                fetchDetailInvesting();
                break;
            case ENUM_INVEST_STATUS.HISTORY:
                fetchDetailHistory();
                break;
            default:
                break;
        }
    }, [status]);

    const fetchDetailInvestNow = useCallback(async () => {
        setIsLoading(true);
        const resInvestNow = await apiServices.invest.getDetailInvestNow(id);
        setIsLoading(false);
        if (resInvestNow.success) {
            const res = resInvestNow.data as PackageInvest;
            setData(res);
        }
    }, [apiServices.invest, id]);

    const fetchDetailInvesting = useCallback(async () => {
        setIsLoading(true);
        const resInvesting = await apiServices.invest.getInvestHaveContract(id);
        setIsLoading(false);
        if (resInvesting.success) {
            const res = resInvesting.data as PackageInvest;
            const history = resInvesting?.history as HistoryModel[];
            setDataHistory(history);
            setData(res);

        }

    }, [apiServices.invest, id]);

    const fetchDetailHistory = useCallback(async () => {
        const resInvestHistory = await apiServices.invest.getInvestHaveContract(id);
        setIsLoading(false);
        if (resInvestHistory.success) {
            const res = resInvestHistory.data as PackageInvest;
            const history = resInvestHistory.history as HistoryModel[];
            setDataHistory(history);
            setData(res);
        }
    }, [apiServices.invest, id]);

    const renderInfoItem = useCallback((label: string, value: string, colorText?: string) => (
        <ItemInfoContract label={label} value={value} colorText={colorText} />
    ), []);

    const renderItem = useCallback((item?: HistoryModel, index?: number) => {
        const txtDue = {
            color: item?.trang_thai === ENUM_STATUS_CONTRACT.PAID ? COLORS.GREEN : COLORS.GRAY_7
        } as TextStyle;

        return (
            <View key={index}>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_13} />
                <View style={styles.wrapItem}>
                    <Text style={[styles.txtValue, txtDue]}>{Utils.formatMoney(item?.so_tien)}</Text>
                    <View style={styles.wrapItemInfo}>
                        <Text style={styles.txtDate}>{item?.ngay_tra_lai}</Text>
                        <Text style={[styles.txtDue, txtDue]}>{item?.trang_thai}</Text>
                    </View>
                </View>
            </View>
        );
    }, []);

    const navigateToInvest = useCallback(() => {
        if (data) {
            Navigator.pushScreen(ScreenName.invest, { id: data?.id, screen: route?.params?.screen });
        }
    }, [data, route?.params?.screen]);

    const renderBottom = useMemo(() => {
        switch (status) {
            case ENUM_INVEST_STATUS.INVEST_NOW:
                return (
                    <Touchable onPress={navigateToInvest} style={styles.button}>
                        <Text style={styles.txtBt}>{Languages.detailInvest.investNow}</Text>
                    </Touchable>
                );
            case ENUM_INVEST_STATUS.INVESTING:
                if (dataHistory?.length !== 0) {
                    return (
                        <View style={styles.wrapInfo}>
                            <Text style={styles.title}>{Languages.detailInvest.infoPayment}</Text>
                            {dataHistory?.map((item: HistoryModel, index: number) => renderItem(item, index))}
                        </View>
                    );
                }
                return null;
            case ENUM_INVEST_STATUS.HISTORY:
                return (
                    <View style={styles.wrapInfo}>
                        <Text style={styles.title}>{Languages.detailInvest.infoPayment}</Text>
                        {dataHistory?.map((item: HistoryModel, index: number) => renderItem(item, index))}
                    </View>
                );
            default:
                return null;
        }
    }, [dataHistory, navigateToInvest, renderItem, status]);

    const renderInfoContract = useMemo(() => {
        if (!isLoading) {
            return (
                <>
                    <View style={styles.wrapInfo}>
                        <Text style={styles.title}>{Languages.detailInvest.information}</Text>
                        {renderInfoItem(Languages.detailInvest.idContract, `${data?.ma_hop_dong}`, COLORS.GREEN)}
                        {renderInfoItem(Languages.detailInvest.moneyInvest, Utils.formatMoney(data?.so_tien_dau_tu), COLORS.GREEN)}
                        {renderInfoItem(Languages.detailInvest.interestYear, `${data?.ti_le_lai_suat_hang_nam}`)}
                        {renderInfoItem(Languages.detailInvest.interestMonth, Utils.formatMoney(data?.lai_hang_thang))}
                        {status !== ENUM_INVEST_STATUS.INVEST_NOW && renderInfoItem(Languages.detailInvest.day, `${data?.ngay_dau_tu}`, '')}
                        {renderInfoItem(Languages.detailInvest.period, `${data?.ki_han_dau_tu}`)}
                        {status !== ENUM_INVEST_STATUS.HISTORY && renderInfoItem(Languages.detailInvest.amountInterest, Utils.formatMoney(data?.tong_lai_du_kien))}
                        {status !== ENUM_INVEST_STATUS.INVEST_NOW && renderInfoItem(Languages.detailInvest.rootPaid, Utils.formatMoney(data?.tong_goc_da_tra))}
                        {status === ENUM_INVEST_STATUS.INVESTING && renderInfoItem(Languages.detailInvest.rootRemaining, Utils.formatMoney(data?.tong_goc_con_lai))}
                        {status !== ENUM_INVEST_STATUS.INVEST_NOW && renderInfoItem(Languages.detailInvest.amountReceived, Utils.formatMoney(data?.tong_lai_da_nhan))}
                        {renderInfoItem(status !== ENUM_INVEST_STATUS.HISTORY ? Languages.detailInvest.expectedDate : Languages.detailInvest.dateDue, `${data?.ngay_dao_han_du_kien}`)}
                        {renderInfoItem(Languages.detailInvest.formality, `${data?.hinh_thuc_tra_lai}`)}
                    </View>
                    {renderBottom}
                </>
            );
        }
        return null;
    }, [data, isLoading, renderInfoItem, status, renderBottom]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.detailInvest.title} hasBack />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                style={styles.wrapContent}
            >
                <View style={styles.wrapIcon}>
                    <IcBag />
                </View>
                {renderInfoContract}
            </ScrollView>
            {isLoading && <Loading isOverview />}
        </View>
    );
});



