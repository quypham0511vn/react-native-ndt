import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import OtpInputs from 'react-native-otp-inputs';

import IcClose from '@/assets/image/invest/ic_close.svg';
import LogoOtpInvest from '@/assets/image/invest/logo_otp_invest.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { useAppStore } from '@/hooks';
import { CheckVimoWalletModel } from '@/models/invest';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { COLORS } from '@/theme/colors';
import { Styles } from '@/theme/styles';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import { Touchable } from '../elements/touchable';

interface PopupOTPProps extends PopupPropsTypes {
    getOTPcode?: () => any,
    idContract?: string,
    title?: string,
}

export const PopupInvestOTP = forwardRef<
    PopupActionTypes,
    PopupOTPProps
>(({  getOTPcode,
    idContract, title }: PopupOTPProps, ref) => {
    const { apiServices } = useAppStore();
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [startCount, setStartCount] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(0);
    const [pin, setPin] = useState<string>('');
    const [erroMsg, setErrMsg] = useState<string>('');
    const intervalRef = useRef<any>();
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
        setErrMsg('');
    }, []);

    const show = useCallback(() => {
        setVisible(true);
        setTimer(60);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
        _onCancel();
    }, [_onCancel]);

    useImperativeHandle(ref, () => ({
        show,
        hide
    }));

    useEffect(() => {
        if (pin.toString().length === 6) {
            onConfirm();
        }
    }, [pin]);

    const onConfirm = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.invest.confirmInvest(idContract || '', pin);
        if (res?.success) {
            const data = res?.data as CheckVimoWalletModel;
            if (data?.status === 200 || data?.status === 201) {
                Alert.alert(data.message || '');
                _onCancel();
                hide();
            }
            else {
                setErrMsg(data?.message);
            }
        }
        else {
            setErrMsg(res?.message || '');
        }
        setLoading(false);
    }, [_onCancel, apiServices.invest, hide, idContract, pin]);

    const onChangeCode = useCallback((code: string) => {
        setPin(code);
        setErrMsg('');
    }, []);

    const onResend = useCallback(async () => {
        await getOTPcode?.();
        setStartCount(true);
        setTimer(60);
    }, [getOTPcode]);

    const renderBtConfirm = useMemo(() => {
        if (!loading) {
            return (
                <Touchable onPress={onConfirm} style={styles.btConfirm}>
                    <Text style={styles.txtBt}>{ Languages.otp.keyOtp.toUpperCase()}</Text>
                </Touchable>
            );
        }
        return (
            <View style={styles.btConfirm}>
                <ActivityIndicator size="small" color={COLORS.WHITE} />
            </View>
        );
    }, [loading, onConfirm]);

    const renderResend = useMemo(() => {
        if (startCount) {
            return (
                <View style={styles.btResend}>
                    <Text style={styles.txtBt}>{`${Languages.otp.resentCode.toUpperCase()} SAU ${Utils.convertSecondToMinutes(timer)}s`}</Text>
                </View>
            );
        }
        return (
            <Touchable onPress={onResend} style={styles.btResendActive}>
                <Text style={styles.txtBt}>{Languages.otp.resentCode.toUpperCase()}</Text>
            </Touchable>
        );
    }, [onResend, startCount, timer]);

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
                    <Text style={styles.txt}>{title}</Text>
                    <View style={styles.boxOtp}>
                        <OtpInputs
                            handleChange={onChangeCode}
                            numberOfInputs={6}
                            style={styles.wrapOTP}
                            inputStyles={styles.viewOtp}
                            focusStyles={styles.focusStyle} 
                            autofillFromClipboard={false}   
                        />
                    </View>
                    {!!erroMsg && <Text style={styles.errTxt}>{erroMsg}</Text>}
                    <View>
                        {renderBtConfirm}
                        {renderResend}
                    </View>
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
        marginHorizontal: 16,
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
        borderColor: COLORS.GRAY_6,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size18
    },
    focusStyle: {

    },
    boxOtp: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SCREEN_WIDTH * 0.01,
        marginBottom: SCREEN_WIDTH * 0.01
    },
    tobModal: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16

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
        backgroundColor: COLORS.WHITE,
        height: SCREEN_WIDTH * 0.14,
        paddingHorizontal: 10,
        flexDirection: 'row',
        marginBottom: 10
    },
    btConfirm: {
        paddingVertical: 16,
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        width: 240,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    btResend: {
        paddingVertical: 16,
        backgroundColor: COLORS.GRAY_6,
        borderRadius: 40,
        width: 240,
        alignItems: 'center'
    },
    btResendActive: {
        paddingVertical: 16,
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        width: 240,
        alignItems: 'center'
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    },
    ic_close: {
        position: 'absolute',
        right: 16,
        top: 16
    },
    errTxt:{
        ...Styles.typography.regular,
        color:COLORS.RED    }
});
