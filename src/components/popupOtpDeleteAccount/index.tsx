import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import OtpInputs from 'react-native-otp-inputs';

import IcClose from '@/assets/image/invest/ic_close.svg';
import LogoOtpInvest from '@/assets/image/invest/logo_otp_invest.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { useAppStore } from '@/hooks';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { COLORS } from '@/theme/colors';
import { Styles } from '@/theme/styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '../elements/touchable';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';

interface PopupOTPProps extends PopupPropsTypes {
    resendOTP?: (phone: string) => any,
}

const TIME_OUT = 60;

export const PopupOtpDeleteAccount = forwardRef<
    PopupActionTypes,
    PopupOTPProps
>(({ onConfirm }: PopupOTPProps, ref: any) => {
    const { userManager, apiServices } = useAppStore();
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [startCount, setStartCount] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(0);
    const [pin, setPin] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);
    const refOTP = useRef<any>(null);
    const intervalRef = useRef<any>();
    const checksumRef = useRef<string>();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        if (timer <= 0) {
            clearInterval(intervalRef.current);
            setStartCount(false);
        }
        return () => {
            clearInterval(intervalRef.current);
            setStartCount(true);
        };
    }, [timer]);

    const _onCancel = useCallback(() => {
        setLoading(false);
        setStartCount(true);
        setTimer(0);
        setPin('');
    }, []);

    const onChangeCode = useCallback((code: string) => {
        setPin(code);
        setErrMsg('');
    }, []);

    const onResend = useCallback(async () => {
        refOTP.current?.reset?.();
        setPin('');
        const res = await apiServices.auth.deleteAccount();
        if (res.success) {
            checksumRef.current = res.data?.checksum;
        }
        setStartCount(true);
        setTimer(TIME_OUT);
    }, [apiServices.auth]);

    const show = useCallback(() => {
        onResend();
        setPin('');
        setVisible(true);
        setTimer(TIME_OUT);
    }, [onResend]);

    const hide = useCallback(() => {
        setVisible(false);
        setErrMsg('');
        _onCancel();
    }, [_onCancel]);

    useImperativeHandle(ref, () => ({
        show,
        hide,
        setErrorOTP
    }));

    const onDeleteAccount = useCallback(async (otp: string) => {
        const res = await apiServices.auth.confirmDeleteAccount(otp, checksumRef.current);
        if (res.success) {
            hide();
            onConfirm?.();
        }
    }, [apiServices.auth, hide, onConfirm]);

    useEffect(() => {
        if (pin.toString().length === 4) {
            onDeleteAccount(pin.toString());
        }
    }, [pin]);

    const renderResend = useMemo(() => {
        if (startCount) {
            return (
                <View style={styles.btResend}>
                    <Text style={styles.txtBt}>{`${Utils.convertSecondToMinutes(timer)} s`}</Text>
                </View>
            );
        }
        return (
            <Touchable onPress={onResend} style={styles.btResendActive}>
                <Text style={styles.txtBt}>{Languages.otp.resentCode.toUpperCase()}</Text>
            </Touchable>
        );
    }, [onResend, startCount, timer]);

    const onFocus = useCallback(() => {
        setFocus(true);
    }, []);

    const onBlur = useCallback(() => {
        setFocus(false);
    }, []);

    const containerStyle = useMemo(() => [styles.container, { transform: [{ translateX: animation }] }], [animation]);

    const styleOTP = useMemo(() => {
        const borderStyle = {
            borderColor: isFocusing ? COLORS.GREEN : COLORS.GRAY_2
        };

        const style = {
            backgroundColor: COLORS.TRANSPARENT
        };

        const backgroundStyle = {
            backgroundColor: isFocusing ? COLORS.WHITE : COLORS.GRAY_2
        };

        if (errMsg !== '') {
            borderStyle.borderColor = COLORS.RED;
        }
        return [styles.viewOtp, borderStyle, backgroundStyle, style];
    }, [errMsg, isFocusing]);

    const startShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [animation]);

    const errorMessage = useMemo(() => {
        const paddingText = { marginTop: - SCREEN_HEIGHT * 0.01 };
        return <View style={paddingText}>
            <Text
                style={styles.errorMessage}>{errMsg}</Text>
        </View>;
    }, [errMsg]);

    const setErrorOTP = useCallback((msg: string) => {
        if (Validate.isStringEmpty(msg)) {
            return;
        }
        setErrMsg(msg);
        startShake();
    }, [startShake]);

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            useNativeDriver={true}
            avoidKeyboard={true}
            hideModalContentWhileAnimating
        >
            <View style={styles.container}>
                <View style={styles.tobModal}>
                    <Touchable onPress={hide} style={styles.ic_close}>
                        <IcClose width={20} height={20} />
                    </Touchable>
                    <LogoOtpInvest width={200} />
                    <Text style={styles.title}>{Languages.otp.title}</Text>
                    <Text style={styles.txt}>{Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(`${userManager.userInfo?.phone_number}`))}</Text>
                    <>
                        <Animated.View style={containerStyle} >
                            <View style={styles.boxOtp}>
                                <OtpInputs
                                    ref={refOTP}
                                    handleChange={onChangeCode}
                                    numberOfInputs={4}
                                    style={styles.wrapOTP}
                                    inputStyles={styleOTP}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    autofillFromClipboard={false}
                                />
                            </View>
                            {errorMessage}
                            <View>
                                {renderResend}
                            </View>
                        </Animated.View>

                    </>
                </View>
            </View>
        </Modal>
    );
});
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.TRANSPARENT,
        borderColor: COLORS.TRANSPARENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        marginTop: 20,
        color: COLORS.GRAY_7
    },
    txt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size14,
        color: COLORS.GRAY_12,
        textAlign: 'center',
        padding: 10
    },
    inputOtp: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: Configs.FontSize.size16
    },
    viewOtp: {
        ...Styles.typography.medium,
        width: (SCREEN_WIDTH - 64 - 5 * 5) / 6,
        height: (SCREEN_WIDTH - 64 - 5 * 5) / 6,
        marginVertical: 10,
        marginHorizontal: 2,
        borderWidth: 1,
        borderRadius: ((SCREEN_WIDTH - 64 - 5 * 5) / 6) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: ((SCREEN_WIDTH - 64 - 5 * 5) / 6) / 2 - 4,
        fontSize: Configs.FontSize.size18
    },
    focusStyle: {

    },
    boxOtp: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SCREEN_WIDTH * 0.01
    },
    inputPhone: {
        marginTop: 10,
        borderRadius: 30,
        paddingVertical: 10,
        width: SCREEN_WIDTH * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    tobModal: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: SCREEN_WIDTH * 0.1 - 10,
        width: SCREEN_WIDTH * 0.9
    },
    underlineStyleBase: {
        width: SCREEN_WIDTH * 0.13,
        height: SCREEN_WIDTH * 0.13,
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size20,
        borderRadius: SCREEN_WIDTH * 0.07,
        justifyContent: 'center'
    },
    wrapOTP: {
        backgroundColor: COLORS.TRANSPARENT,
        height: SCREEN_WIDTH * 0.18,
        width: SCREEN_WIDTH * 0.9,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    btConfirm: {
        paddingVertical: 10,
        backgroundColor: COLORS.GREEN,
        borderRadius: 30,
        width: SCREEN_WIDTH * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20
    },
    btResend: {
        paddingVertical: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 40,
        width: 240,
        alignItems: 'center'
    },
    btResendActive: {
        paddingVertical: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 40,
        width: 240,
        alignItems: 'center'
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.RED_2
    },
    ic_close: {
        position: 'absolute',
        right: 16,
        top: 16
    },
    errTxt: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED,
        marginHorizontal: 10,
        paddingTop: 10
    }
});
