import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import IcLine from '@/assets/image/auth/ic_line_auth.svg';
import CheckIcon from '@/assets/image/ic_isChecked_save_acc.svg';
import UnCheckIcon from '@/assets/image/ic_unchecked_save_acc.svg';
import arrayIcon from '@/common/arrayIcon';
import Languages from '@/common/Languages';
import ScreenName, { TabNamesArray } from '@/common/screenNames';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import Loading from '@/components/loading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { MyStylesLogin } from './styles';
import { UserInfoModal } from '@/models/user-models';
import HideKeyboard from '@/components/HideKeyboard';
import FormValidate from '@/utils/FormValidate';
import { MyTextInputKeyboardNavigation } from '@/components/elements/textfieldKeyboardNavigation';

const Login = observer(() => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager: fastAuthInfo
    } = useAppStore();

    const [phone, setPhone] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [userData, setUserData] = useState<UserInfoModal>();
    const styles = MyStylesLogin();
    const refPhone = useRef<TextFieldActions>(null);
    const refPass = useRef<TextFieldActions>(null);
    const [checked, setCheck] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (SessionManager.getPhoneLogin()) {
            setPhone(SessionManager.getPhoneLogin() || '');
            setCheck(true);
        }
        if (SessionManager.getPwdLogin()) {
            setPass(SessionManager.getPwdLogin() || '');
            setCheck(true);
        }
    }, []);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.auth.txtPhone:
                setPhone(value);
                break;
            case Languages.auth.txtPass:
                setPass(value);
                break;
            default:
                break;
        }
    }, []);

    const onValidate = useCallback(() => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgPwd = FormValidate.passValidate(pass);

        refPhone.current?.setErrorMsg(errMsgPhone);
        refPass.current?.setErrorMsg(errMsgPwd);
        if (`${errMsgPhone}${errMsgPwd}`.length === 0) {
            return true;
        }
        return false;
    }, [pass, phone]);

    const onChangeChecked = useCallback(() => {
        setCheck(last => !last);
    }, []);

    const checkbox = useMemo(() => {
        if (checked) {
            return <CheckIcon />;
        }
        return <UnCheckIcon />;
    }, [checked]);

    const renderInput = useCallback((
        ref: any,
        value: any,
        isPhone: boolean,
        placeHolder: string,
        rightIcon?: string,
        keyboardType?: any,
        maxLength?: number,
        isPass?: boolean,
        orderRef?: number,
        inputAccessoryViewID?: string,
        textContentType?: string
    ) => (
        <MyTextInputKeyboardNavigation
            ref={ref}
            refArr={[refPhone, refPass]}
            orderRef={orderRef}
            inputAccessoryViewID={inputAccessoryViewID}
            value={value}
            isPhoneNumber={isPhone}
            maxLength={maxLength}
            rightIcon={rightIcon}
            placeHolder={placeHolder}
            containerInput={styles.inputPhone}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            isPassword={isPass}
            textContentType={textContentType}
        />
    ), [onChangeText, styles.inputPhone]);

    const onLoginPhone = useCallback(async () => {
        if (onValidate()) {
            setLoading(true);
            const res = await apiServices.auth.loginPhone(phone, pass);
            setLoading(false);
            if (res.success) {
                setLoading(false);
                const resData = res.data as UserInfoModal;
                SessionManager.setAccessToken(resData?.token);
                const resInfoAcc = await apiServices.auth.getUserInfo();
                if (resInfoAcc.success) {
                    if (!checked) {
                        SessionManager.setSavePhoneLogin('');
                        SessionManager.setSavePassLogin('');
                    } else {
                        SessionManager.setSavePhoneLogin(phone);
                        SessionManager.setSavePassLogin('');
                    }
                    fastAuthInfo.setEnableFastAuthentication(false);
                    const data = resInfoAcc?.data as UserInfoModal;
                    setUserData(data);
                    userManager.updateUserInfo({
                        ...data
                    });
                }
                setTimeout(() => {
                    if (SessionManager.accessToken) {
                        Navigator.navigateToDeepScreen(
                            [ScreenName.tabs],
                            TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]
                        );
                    }
                }, 200);
            }
        }
    }, [onValidate, apiServices.auth, phone, pass, checked, fastAuthInfo, userManager]);

    return (
        <HideKeyboard>
            <View style={styles.content}>

                <View style={styles.wrapLoginTxt}>
                    <Text style={styles.txtTitle}>{Languages.auth.txtLogin}</Text>
                    <IcLine width={'40%'} height={'20%'} />
                </View>
                {renderInput(refPhone, phone, true, Languages.auth.txtPhone, arrayIcon.login.phone, 'NUMBER', 10, false, 1, 'inputAccessoryViewID1', 'telephoneNumber')}
                {renderInput(refPass, pass, false, Languages.auth.txtPass, arrayIcon.login.pass, 'DEFAULT', 50, true, 2, 'inputAccessoryViewID2')}
                <View style={styles.rowInfo}>
                    <View style={styles.checkbox} >
                        <Touchable style={styles.checkboxBtn} onPress={onChangeChecked}>{checkbox}</Touchable>
                        <Text style={styles.txtSave}>{Languages.auth.saveAcc}</Text>
                    </View>

                    <Touchable onPress={onLoginPhone} disabled={!(phone !== '' && pass !== '')}
                        style={(phone !== '' && pass !== '') ? styles.tobLogin : [styles.tobLogin, { backgroundColor: COLORS.GRAY_13 }]}>
                        <Text style={(phone !== '' && pass !== '') ? styles.txtSubmit : [styles.txtSubmit, { color: COLORS.GRAY_12 }]}>
                            {Languages.auth.txtLogin}
                        </Text>
                    </Touchable>
                </View>
                {isLoading && <Loading isOverview />}
            </View>
        </HideKeyboard>
    );
});

export default Login;
