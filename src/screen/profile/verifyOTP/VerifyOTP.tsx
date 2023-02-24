import OTPInputView from '@twotalltotems/react-native-otp-input';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import VimoIC from '@/assets/image/ic_logo_vimo_large.svg';
import Languages from '@/common/Languages';
import { Button } from '@/components/elements/button';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import HideKeyboard from '@/components/HideKeyboard';
import Loading from '@/components/loading';
import { useAppStore } from '@/hooks';
import { DataSendLinkVimoModal } from '@/models/payment-link-models';
import { HtmlStyles } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { MyStylesVerifyOTP } from './styles';
import Navigator from '@/routers/Navigator';

const VerifyOTP = observer(({ route }: { route: any }) => {
    const { apiServices } = useAppStore();
    const styles = MyStylesVerifyOTP();
    const [linked_id, setLinked] = useState<string>(route?.params?.linked_code);
    const [phone, setPhone] = useState<string>(route?.params?.phoneNumber);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [otp, setOTP] = useState<string>('');
    const time = 120000;    // set time resend OTP = 120s
    const [overTime, setOverTime] = useState<number>(time);
    const intervalRef = useRef<any>();

    useEffect(() => {
        if (overTime > 0) {
            intervalRef.current = setInterval(() => {
                setOverTime(timer => timer - 1000);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [overTime]);

    useEffect(() => {
        if (overTime <= 0) {
            clearInterval(intervalRef.current);
        }
    }, [overTime]);

    const onCodeChanged = useCallback((code:string) => {
        setOTP(code);
    }, []);

    const onConfirmOTP = useCallback(async () => {
        if (otp.length === 6) {
            setIsLoading(true);
            const res = await apiServices.paymentMethod.requestActiveLinkVimo(phone, linked_id, otp);
            if (res.success) {
                ToastUtils.showSuccessToast(Languages.msgNotify.successVimoLink);
                setIsLoading(false);
                Navigator.popScreen(2); // back to paymentMethod screen
            }
            setIsLoading(false);
        }
    }, [apiServices.paymentMethod, linked_id, otp, phone]);

    const onAgreeResendOTP = useCallback(async () => {
        setIsLoading(true);
        setOverTime(time);
        setOTP('');
        const res = await apiServices.paymentMethod.requestSendLinkVimo(phone);
        if (res.success) {
            ToastUtils.showSuccessToast(Languages.msgNotify.successReOTPVimo);
            const data = res.data as DataSendLinkVimoModal;
            setLinked(data.linked_id);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, [apiServices.paymentMethod, phone, time]);

    return (
        <HideKeyboard style={styles.container}>
            <View style={styles.container}>
                <HeaderBar isLight={false} title={Languages.confirmPhone.verifyOTP} hasBack />
                <View style={styles.logo}>
                    <VimoIC />
                </View>
                <View style={styles.wrapAllContent}>
                    <HTMLView
                        value={Languages.confirmPhone.noteVerifyOTP.replace('%phone', Utils.encodePhone(phone))}
                        stylesheet={HtmlStyles || undefined}
                    />
                    <OTPInputView
                        style={styles.wrapOTp}
                        pinCount={6}
                        autoFocusOnLoad
                        onCodeChanged={onCodeChanged}
                        editable={true}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        code={otp}
                    />
                    {overTime ?
                        <Text style={styles.reSendCodeText}>
                            {`${Languages.confirmPhone.reSendCode}${Utils.covertSecondAndGetMinute(overTime)}:${Utils.covertSecondAndGetSecond(overTime)}`}
                        </Text> :
                        <Touchable onPress={onAgreeResendOTP} style={styles.wrapReSendOtp}>
                            <Text style={styles.reSendOtpTXT}>{`${Languages.confirmPhone.reSendOTP}`}</Text>
                        </Touchable>
                    }

                    <Button label={Languages.confirmPhone.verifyOTP}
                        buttonStyle={BUTTON_STYLES.GREEN}
                        isLowerCase
                        onPress={onConfirmOTP}
                    />
                </View>
                {isLoading && <Loading isOverview />}
            </View>
        </HideKeyboard >
    );
});

export default VerifyOTP;
