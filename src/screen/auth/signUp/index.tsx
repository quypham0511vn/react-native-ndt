import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View, ViewStyle } from 'react-native';

import IcLine from '@/assets/image/auth/ic_line_auth.svg';
import CheckIcon from '@/assets/image/ic_isChecked_save_acc.svg';
import UnCheckIcon from '@/assets/image/ic_unchecked_save_acc.svg';
import ICUnderArrow from '@/assets/image/ic_under_arrow.svg';
import arrayIcon from '@/common/arrayIcon';
import { FRIEND_INVITE_ID } from '@/common/Configs';
import Languages from '@/common/Languages';
import { ItemProps } from '@/components/bottomSheet';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { MyTextInputKeyboardNavigation } from '@/components/elements/textfieldKeyboardNavigation';
import { Touchable } from '@/components/elements/touchable';
import HideKeyboard from '@/components/HideKeyboard';
import Loading from '@/components/loading';
import PickerBottomSheet from '@/components/PickerBottomSheet';
import { useAppStore } from '@/hooks';
import { COLORS } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import OtpSignIn from '../otpSignIn';
import { MyStylesSign } from './styles';

const SignUp = observer(({ dataChannel }: { dataChannel?: ItemProps[] }) => {
    const { apiServices } = useAppStore();
    const [phone, setPhone] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [passNew, setPassNew] = useState<string>('');
    const [channel, setChannel] = useState<ItemProps>();
    const [refCode, setRefCode] = useState<string>('');
    const [errChannel, setErrChannel] = useState<string>('');
    // const [data, setData] = useState<any>('');
    const [isNavigate, setNavigate] = useState<boolean>(false);
    const styles = MyStylesSign();
    const refPhone = useRef<TextFieldActions>(null);
    const refName = useRef<TextFieldActions>(null);
    const refEmail = useRef<TextFieldActions>(null);
    const refChannel = useRef<BottomSheetModal>(null);
    const refPass = useRef<TextFieldActions>(null);
    const refPassNew = useRef<TextFieldActions>(null);
    const refRefCode = useRef<TextFieldActions>(null);
    const [checked, setCheck] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isShowReferral, setShowReferral] = useState<boolean>(false);
    const scrollRef = useRef<ScrollView>(null);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.auth.txtPhone:
                setPhone(value);
                break;
            case Languages.auth.txtPass:
                setPass(value);
                break;
            case Languages.auth.txtName:
                setName(value);
                break;
            case Languages.auth.txtConfirmPass:
                setPassNew(value);
                break;
            case Languages.auth.txtEmail:
                setEmail(value);
                break;
            case Languages.auth.txtRefCode:
                setRefCode(value);
                break;
            default:
                break;
        }
    }, []);

    const onChangeChecked = useCallback(() => {
        setCheck(last => !last);
    }, []);

    const checkbox = useMemo(() => {
        if (checked) {
            return <CheckIcon />;
        }
        return <UnCheckIcon />;
    }, [checked]);

    const onValidate = useCallback(() => {
        const errMsgName = FormValidate.userNameValidate(name);
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgPwd = FormValidate.passValidate(pass);
        const errMsgPwdNew = FormValidate.passConFirmValidate(pass, passNew);
        const errMsgPwdEmail = FormValidate.emailValidate(email);
        const _errChannel = FormValidate.inputEmpty(channel?.id, Languages.errorMsg.channelRequired);
        let errRefCode = '';
        if (parseInt?.(channel?.id || '0', 10) === FRIEND_INVITE_ID) {
            errRefCode = FormValidate.referralValidate(refCode);
        }
        if (`${_errChannel}${errRefCode}`.length > 0) {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd();
            }, 300);
        }

        setErrChannel(_errChannel);

        refName.current?.setErrorMsg(errMsgName);
        refPhone.current?.setErrorMsg(errMsgPhone);
        refEmail.current?.setErrorMsg(errMsgPwdEmail);
        refPass.current?.setErrorMsg(errMsgPwd);
        refPassNew.current?.setErrorMsg(errMsgPwdNew);
        refRefCode.current?.setErrorMsg(errRefCode);

        if (`${errMsgName}${errMsgPhone}${errMsgPwdEmail}${errMsgPwd}${errMsgPwdNew}${_errChannel}${errRefCode}`.length === 0) {
            return true;
        }
        return false;
    }, [channel, refCode, email, name, pass, passNew, phone]);

    const onSignUp = useCallback(async () => {
        if (onValidate()) {
            setLoading(true);
            const res = await apiServices.auth.registerAuth(phone, name, pass, passNew, email, channel?.id || '', refCode);
            setLoading(false);
            if (res.success) {
                ToastUtils.showSuccessToast(Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone)));
                setNavigate(true);
            }
        }
    }, [onValidate, apiServices.auth, phone, name, pass, passNew, email, channel?.id, refCode]);

    const onChangeChanel = (item: any) => {
        setChannel(item);
        setErrChannel('');

        if (item?.id === FRIEND_INVITE_ID) {
            setShowReferral(true);
            setTimeout(() => {
                scrollRef.current?.scrollToEnd();
            }, 300);
        } else {
            setShowReferral(false);
        }
    };

    const renderInput = useCallback((
        ref: any,
        value: string,
        isPhoneNumber: boolean,
        rightIcon: string,
        placeHolder: string,
        maxLength: number,
        isPassword?: boolean,
        keyboardType?: any,
        orderRef?: number,
        inputAccessoryViewID?: string,
        textContentType?: string,
        capitalize?: any
    ) =>
        <MyTextInputKeyboardNavigation
            ref={ref}
            refArr={[refName, refPhone, refEmail, refPass, refPassNew, refCode]}
            orderRef={orderRef}
            inputAccessoryViewID={inputAccessoryViewID}
            value={value}
            isPhoneNumber={isPhoneNumber}
            maxLength={maxLength}
            rightIcon={rightIcon}
            placeHolder={placeHolder}
            containerInput={styles.inputPass}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            isPassword={isPassword}
            textContentType={textContentType}
            autoCapitalized={capitalize}
        />, [onChangeText, refCode, styles.inputPass]);

    const renderReferral = useCallback((
        ref: any,
        value: string,
        isPhoneNumber: boolean,
        rightIcon: string,
        placeHolder: string,
        maxLength: number,
        isPassword?: boolean,
        keyboardType?: any,
        orderRef?: number,
        inputAccessoryViewID?: string,
        textContentType?: string
    ) => isShowReferral && <MyTextInputKeyboardNavigation
        ref={ref}
        refArr={[refName, refPhone, refEmail, refPass, refPassNew, refCode]}
        orderRef={orderRef}
        inputAccessoryViewID={inputAccessoryViewID}
        value={value}
        isPhoneNumber={isPhoneNumber}
        maxLength={maxLength}
        rightIcon={rightIcon}
        placeHolder={placeHolder}
        containerInput={styles.inputPass}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        isPassword={isPassword}
        textContentType={textContentType}
    />, [isShowReferral, onChangeText, refCode, styles.inputPass]);

    const getChannelContainer = useMemo(() => [styles.containerOverViewPicker, { borderColor: errChannel ? COLORS.RED : COLORS.GRAY_11 }] as ViewStyle, [errChannel, styles.containerOverViewPicker]);

    const renderView = () => (
        <View style={styles.content}>
            <View style={styles.wrapLoginTxt}>
                <Text style={styles.txtTitle}>{Languages.auth.txtSignUp}</Text>
                <IcLine width={'50%'} height={'10%'} />
            </View>
            <ScrollView
                ref={scrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {renderInput(refName, name, false, arrayIcon.login.name, Languages.auth.txtName, 30, false, 'DEFAULT', 1, 'inputAccessoryViewID1', 'name', 'words')}
                {renderInput(refPhone, phone, true, arrayIcon.login.phone, Languages.auth.txtPhone, 10, false, 'NUMBER', 2, 'inputAccessoryViewID2', 'telephoneNumber')}
                {renderInput(refEmail, email, false, arrayIcon.login.email, Languages.auth.txtEmail, 50, false, 'EMAIL', 3, 'inputAccessoryViewID3', 'emailAddress')}
                {renderInput(refPass, pass, false, arrayIcon.login.pass, Languages.auth.txtPass, 50, true, 'DEFAULT', 4, 'inputAccessoryViewID4')}
                {renderInput(refPassNew, passNew, false, arrayIcon.login.confirmPass, Languages.auth.txtConfirmPass, 50, true, 'DEFAULT', 5, 'inputAccessoryViewID5')}
                <View style={styles.inputChannel}>
                    <PickerBottomSheet
                        ref={refChannel}
                        containerStyle={getChannelContainer}
                        rightIcon={<ICUnderArrow />}
                        placeholder={Languages.auth.knowChannel}
                        onPressItem={onChangeChanel}
                        value={channel?.value}
                        data={dataChannel}
                        valueText={styles.valuePicker}
                        btnContainer={styles.containerPicker}
                        placeholderStyle={styles.containerPlaceholderPicker}
                    />
                </View>
                {errChannel ? <Text
                    style={styles.errorMessage}>{errChannel}</Text> : null}
                {renderReferral(refRefCode, refCode, true, arrayIcon.login.referral_code, Languages.auth.txtRefCode, 10, false, 'NUMBER', 6, 'inputAccessoryViewID6')}
            </ScrollView>
            <View style={styles.rowInfo}>
                {/* <View style={styles.row}>
                            <Touchable style={styles.checkbox} onPress={onChangeChecked}>
                                {checkbox}
                            </Touchable>
                            <Text style={styles.txtSave}>{Languages.auth.saveAcc}</Text>
                        </View> */}
                <Touchable onPress={onSignUp}
                    style={styles.tobLogin}>
                    <Text style={styles.txtSubmit}>
                        {Languages.auth.txtSignUp}
                    </Text>
                </Touchable>
            </View>
            {isLoading && <Loading isOverview />}
        </View>
    );

    return (
        <HideKeyboard>
            <View style={styles.container}>
                {isNavigate ? <OtpSignIn phone={phone} isChecked={checked} pass={pass} /> : renderView()}
            </View>
        </HideKeyboard>
    );
});

export default SignUp;
