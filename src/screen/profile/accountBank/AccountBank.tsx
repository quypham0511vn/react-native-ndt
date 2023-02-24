import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

import LinkIC from '@/assets/image/ic_isChecked_save_acc.svg';
import BankIC from '@/assets/image/ic_bank.svg';
import NotLinkIC from '@/assets/image/ic_unchecked_save_acc.svg';
import { TYPE_INTEREST_RECEIVE_ACC } from '@/common/constants';
import Languages from '@/common/Languages';
import { Button } from '@/components/elements/button';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import HideKeyboard from '@/components/HideKeyboard';
import PickerBankValuation from '@/components/PickerBankValuation';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS, HtmlStyles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import { MyStylesAccountBank } from './styles';
import ScrollViewWithKeyboard from '@/components/scrollViewWithKeyboard';
import { useAppStore } from '@/hooks';
import { ItemProps } from '@/models/common-model';
import ToastUtils from '@/utils/ToastUtils';
import Loading from '@/components/loading';
import { UserInfoModal } from '@/models/user-models';
import { DataBanksModal } from '@/models/payment-link-models';
import Utils from '@/utils/Utils';
import Navigator from '@/routers/Navigator';

const AccountBank = observer(() => {
    const { apiServices, userManager } = useAppStore();
    const styles = MyStylesAccountBank();
    const [dataBanks, setDataBanks] = useState<ItemProps[]>([]);
    const [banks, setBanks] = useState<string>(userManager.userInfo?.tra_lai?.bank_name || '');
    const [nameBank, setNameBank] = useState<string>(userManager.userInfo?.tra_lai?.bank_name || '');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [ATMNumber, setATMNumber] = useState<string>('');
    const [typeCard, setTypeCard] = useState<number>(userManager.userInfo?.tra_lai?.type_card || 1);
    const [accountProvider, setAccountProvider] = useState<string>(userManager.userInfo?.tra_lai?.name_bank_account || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const accountNumberRef = useRef<TextFieldActions>(null);
    const ATMNumberRef = useRef<TextFieldActions>(null);
    const accountProviderRef = useRef<TextFieldActions>(null);
    const bankRef = useRef<PopupActionTypes>(null);
    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus) {
            if (userManager.userInfo?.tra_lai?.type_card === 1) {
                setAccountNumber(userManager.userInfo?.tra_lai?.interest_receiving_account || '');
            } else {
                setATMNumber(userManager.userInfo?.tra_lai?.interest_receiving_account || '');
            }
        }
    }, [isFocus, userManager.userInfo?.tra_lai?.interest_receiving_account, userManager.userInfo?.tra_lai?.type_card]);

    useEffect(() => {
        fetchBankList();
    }, []);

    const fetchBankList = useCallback(async () => {
        const res = await apiServices.paymentMethod.getBank();
        if (res.success) {
            const data = res.data as DataBanksModal[];
            const temp = data?.map((item) => ({ id: item?.bank_code, value: item?.name, text: item?.short_name, icon: item?.icon })) as ItemProps[];
            const firstName = temp?.filter((item) => item?.id === nameBank) as ItemProps[];
            setNameBank(`${firstName?.[0]?.value || ''}${firstName?.[0]?.value ? ' - ' : ''}${firstName?.[0]?.text || ''}`);
            setDataBanks(temp);
        }
    }, [apiServices.paymentMethod, nameBank]);

    const onChangeText = useCallback((value?: any, tag?: any) => {
        switch (tag) {
            case Languages.accountBank.accountNumber:
                return setAccountNumber(value);
            case Languages.accountBank.ATMNumber:
                return setATMNumber(value);
            case Languages.accountBank.accountProvider:
                return setAccountProvider(Utils.formatForEachWordCase(value));
            default:
                return null;
        }
    }, []);

    const renderInput = useCallback((_title?: string, _placeHolder?: string, _text?: string, _ref?: any, typeKeyboard?: any, length?: number) => {
        const onChange = (text: string) => {
            onChangeText(text, _title);
        };
        return <View style={styles.groupInput}>
            <Text style={styles.title}>{_title}</Text>
            <MyTextInput
                ref={_ref}
                autoCapitalized={'words'}
                placeHolder={_placeHolder}
                keyboardType={typeKeyboard}
                containerInput={styles.containerStyle}
                inputStyle={styles.inputStyle}
                inputStylePwDIcon={styles.pwd}
                isPassword={false}
                maxLength={length}
                value={_text}
                onChangeText={onChange}
                hasUnderline={false}
                placeHolderColor={COLORS.GRAY_16}
            />
        </View>;
    }, [onChangeText, styles.containerStyle, styles.groupInput, styles.inputStyle, styles.pwd, styles.title]);

    const renderAccBank = useCallback((title?: string, status?: boolean) => {

        const onPressType = () => {
            switch (title) {
                case Languages.accountBank.accountNumber:
                    setTypeCard(1);
                    setATMNumber('');
                    setAccountNumber('');
                    break;
                case Languages.accountBank.ATMNumber:
                    setTypeCard(2);
                    setAccountNumber('');
                    setATMNumber('');
                    break;
                default:
                    setTypeCard(1);
                    setATMNumber('');
                    setAccountNumber('');
                    break;
            }
        };

        return (
            <Touchable style={styles.rowContainerItemInputChoose} onPress={onPressType} disabled={status} >
                {status ?
                    <LinkIC width={20} height={20} /> :
                    <NotLinkIC width={20} height={20} />
                }
                <Text style={styles.textChooseToInput}>{title}</Text>
            </Touchable>
        );
    }, [styles.rowContainerItemInputChoose, styles.textChooseToInput]);

    const onBanksChoose = useCallback((item?: ItemProps) => {
        setBanks(item?.id || '');
        setNameBank(`${item?.value}${' - '}${item?.text}` || '');
    }, []);

    const onValidate = useCallback(() => {
        const errMsgBank = FormValidate.inputEmpty(banks, Languages.errorMsg.errBankEmpty);
        const errMsgAccNumber = FormValidate.inputValidate(accountNumber, Languages.errorMsg.errStkEmpty, Languages.errorMsg.errStk, 16, true);
        const errMsgATMNumber = FormValidate.inputValidate(ATMNumber, Languages.errorMsg.errStkEmpty, Languages.errorMsg.errStk, 19, false, true);
        const errMsgName = FormValidate.inputNameEmpty(Utils.formatForEachWordCase(accountProvider), Languages.errorMsg.errNameEmpty, Languages.errorMsg.userNameRegex);

        accountNumberRef.current?.setErrorMsg(errMsgAccNumber);
        ATMNumberRef.current?.setErrorMsg(errMsgATMNumber);
        accountProviderRef.current?.setErrorMsg(errMsgName);
        bankRef.current?.setErrorMsg?.(errMsgBank);

        if (
            `${errMsgName}${errMsgBank}`.length === 0 && (`${errMsgAccNumber}`.length === 0 || `${errMsgATMNumber}`.length === 0)
        ) {
            return true;
        }
        return false;
    }, [ATMNumber, accountNumber, accountProvider, banks]);

    const onAddAccount = useCallback(async () => {
        setIsLoading(true);
        if (onValidate()) {
            const res = await apiServices.paymentMethod.requestChoosePaymentReceiveInterest(
                TYPE_INTEREST_RECEIVE_ACC.BANK,
                banks,
                typeCard === 1 ? accountNumber : ATMNumber,
                accountProvider,
                typeCard
            );
            if (res.success) {
                ToastUtils.showSuccessToast(Languages.msgNotify.successAccountLinkBank);
                setIsLoading(false);
                const resUser = await apiServices.auth.getUserInfo();
                if (resUser.success) {
                    const user = resUser.data as UserInfoModal;
                    userManager.updateUserInfo({
                        ...userManager.userInfo,
                        ...user
                    });
                    Navigator.goBack();
                }
            }
        }
        setIsLoading(false);
    }, [ATMNumber, accountNumber, accountProvider, apiServices.auth, apiServices.paymentMethod, banks, onValidate, typeCard, userManager]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheetModalProvider>
                <HideKeyboard style={styles.container}>
                    <View style={styles.container}>
                        <HeaderBar isLight={false} title={Languages.paymentMethod.bank} hasBack />
                        <ScrollViewWithKeyboard showsVerticalScrollIndicator={false}>
                            <View style={styles.wrapAllContent}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                                    <Text style={styles.txtBankChoose}>{Languages.accountBank.bankChoose}</Text>
                                    <PickerBankValuation
                                        ref={bankRef}
                                        data={dataBanks}
                                        value={nameBank}
                                        placeholder={Languages.accountBank.bankChoose}
                                        onPressItem={onBanksChoose}
                                        btnContainer={styles.rowItemFilter}
                                        containerStyle={styles.containerItemFilter}
                                        hasDash
                                        hasInput
                                        isValueBank
                                        styleText={styles.valuePicker}
                                        stylePlaceholder={styles.placeHolderPicker}
                                        leftIcon={<BankIC width={30} height={30} />}
                                    />
                                    <View style={styles.rowContainerAllInputChoose}>
                                        {renderAccBank(Languages.accountBank.accountNumber,
                                            typeCard === 1)}
                                        {renderAccBank(Languages.accountBank.ATMNumber,
                                            typeCard === 2)}
                                    </View>
                                    {renderInput(
                                        typeCard === 1 ? Languages.accountBank.accountNumber : Languages.accountBank.ATMNumber,
                                        typeCard === 1 ? Languages.accountBank.accountNumber : Languages.accountBank.ATMNumber,
                                        typeCard === 1 ? accountNumber : ATMNumber,
                                        typeCard === 1 ? accountNumberRef : ATMNumberRef,
                                        'NUMBER',
                                        typeCard === 1 ? 16 : 19
                                    )}
                                    {renderInput(
                                        Languages.accountBank.accountProvider,
                                        Languages.accountBank.accountProviderName,
                                        accountProvider,
                                        accountProviderRef,
                                        'DEFAULT',
                                        50)
                                    }
                                </KeyboardAvoidingView>
                                <HTMLView
                                    value={Languages.accountBank.noteAccountBank}
                                    stylesheet={HtmlStyles || undefined} />

                                <Button label={Languages.accountBank.updateAccBank}
                                    buttonStyle={nameBank && accountProvider && (accountNumber || ATMNumber) ? BUTTON_STYLES.GREEN : BUTTON_STYLES.GRAY}
                                    isLowerCase
                                    onPress={onAddAccount}
                                    disabled={!nameBank || !accountProvider || (!accountNumber && !ATMNumber)}
                                    style={styles.wrapBtnAddAcc}
                                />
                            </View>
                        </ScrollViewWithKeyboard>
                        {isLoading && <Loading isOverview />}
                    </View >
                </HideKeyboard>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
});

export default AccountBank;

