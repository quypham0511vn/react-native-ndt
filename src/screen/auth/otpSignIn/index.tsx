import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { observer } from 'mobx-react-lite';

import IcLine from '@/assets/image/auth/ic_line_auth.svg';
import Languages from '@/common/Languages';
import ScreenName from '@/common/screenNames';
import { Touchable } from '@/components/elements/touchable';
import Loading from '@/components/loading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import { UserInfoModal } from '@/models/user-models';
import Navigator from '@/routers/Navigator';
import { MyStylesOtp } from '@/screen/auth/otpSignIn/styles';
import ChangePass from '../changePass';
import { COLORS } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';

const OtpSignIn = observer((props: any) => {
    let timer = 0;
    const [check, setCheck] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isNavigate, setIsNavigate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const phone = props.phone;
    const pass = props.pass;
    const [token, setToken] = useState<string>();
    const [timerCount, setTimerCount] = useState(60);
    const styles = MyStylesOtp();
    const { apiServices, userManager } = useAppStore();

    useEffect(() => {
        setCheck(true);
        setIsActive(true);
        timer = getTime() + 60;
        refreshCountdown();
    }, [props.check]);

    const refreshCountdown = () => {
        setTimeout(() => {
            if (timer - getTime() <= 0) {
                setIsActive(false);
                setTimerCount(60);
                setCheck(false);
            } else {
                setTimerCount(timer - getTime());
                refreshCountdown();
            }
        }, 1000);
    };

    const getTime = () => Math.floor(Date.now() / 1000);

    const onChangeCode = useCallback((code: string) => {
        setToken(code);
    }, []);

    const onPressOtp = async () => {
        if (props?.isChangePass) {
            setIsLoading(true);
            const res = await apiServices.auth.validateToken(token, phone);
            setIsLoading(false);
            if (res.success) {
                setIsNavigate(true);
            }
        } else {
            setIsLoading(true);
            const res = await apiServices.auth.activeAccount(
                token,
                phone
            );
            setIsLoading(false);
            if (res.success) {
                if (!props.isChecked) {
                    SessionManager.setSavePhoneLogin('');
                    SessionManager.setSavePassLogin('');
                } else {
                    SessionManager.setSavePhoneLogin(phone);
                    SessionManager.setSavePassLogin(pass);
                }
                const temp = res?.data as UserInfoModal;
                if (temp?.token) {
                    SessionManager.setAccessToken(temp?.token);
                    const resInfoAcc = await apiServices.auth.getUserInfo();
                    if (resInfoAcc.success) {
                        const resData = resInfoAcc.data as UserInfoModal;
                        userManager.updateUserInfo(resData);
                    }
                }
                Navigator.navigateScreen(ScreenName.success, { isCheckLoginGoogle: false });
            }
        }
    };

    const sendOTP = useCallback(async () => {
        setIsLoading(true);
        if (!props?.isChangePass) {
            const resSendOTP = await apiServices.auth.otpResendToken(phone);
            if (resSendOTP.success) {
                ToastUtils.showSuccessToast(Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone)));
                setCheck(true);
                setIsActive(true);
                timer = getTime() + 60;
                refreshCountdown();
            }
        } else {
            const resSendOTP = await apiServices.auth.otpResetPwd(phone);
            if (resSendOTP.success) {
                ToastUtils.showSuccessToast(Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone)));
                setCheck(true);
                setIsActive(true);
                timer = getTime() + 60;
                refreshCountdown();
            }
        }
        setIsLoading(false);
    }, [getTime]);

    const renderOTP = () => {
        let isDisTouchable: boolean;
        if (token?.length === 6) {
            isDisTouchable = false;
        } else {
            isDisTouchable = true;
        }

        return (
            <View style={styles.container}>
                <View style={styles.viewTop}>
                    <Text style={styles.txtTitle}>{Languages.auth.txtTitleOtp}</Text>
                    <IcLine width={'35%'} height={'40%'} />
                </View>
                <Text style={styles.confirmOtp}>{Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone))}</Text>
                <View style={styles.boxOtp}>
                    <OtpInputs
                        handleChange={onChangeCode}
                        numberOfInputs={6}
                        style={styles.wrapOTP}
                        inputStyles={styles.viewOtp} 
                        autofillFromClipboard={false}
                    />
                </View>
                <Touchable style={isDisTouchable ? [styles.tobConfirm, { backgroundColor: COLORS.GRAY_13 }] : styles.tobConfirm}
                    onPress={onPressOtp} disabled={isDisTouchable}>
                    <Text style={isDisTouchable ? styles.disTxtConfirm : styles.txtConfirm}>{Languages.auth.conFirm}</Text>
                </Touchable>

                <Touchable style={styles.sentOtp} disabled={check} onPress={sendOTP}>
                    {check ?
                        <Text style={styles.txtOtp}>{Languages.otp.sentOtp1}{timerCount}</Text> :
                        <Text style={styles.txtOtp}>{Languages.otp.sentOtp2}</Text>
                    }
                </Touchable>
                {isLoading && <Loading isOverview />}
            </View>
        );
    };

    return (
        <>
            {isNavigate ? <ChangePass phone={phone} token={token} /> : renderOTP()}
        </>
    );
});
export default OtpSignIn;

