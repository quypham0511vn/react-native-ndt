import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import OtpInputs from 'react-native-otp-inputs';

import ICUnderArrow from '@/assets/image/ic_under_arrow.svg';
import IcClose from '@/assets/image/invest/ic_close.svg';
import LogoOtpInvest from '@/assets/image/invest/logo_otp_invest.svg';
import arrayIcon from '@/common/arrayIcon';
import { Configs, FRIEND_INVITE_ID } from '@/common/Configs';
import Languages from '@/common/Languages';
import { useAppStore } from '@/hooks';
import { ItemProps } from '@/models/common-model';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { COLORS } from '@/theme/colors';
import { Styles } from '@/theme/styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';
import { TextFieldActions } from '../elements/textfield/types';
import { MyTextInputKeyboardNavigation } from '../elements/textfieldKeyboardNavigation';
import { Touchable } from '../elements/touchable';
import Loading from '../loading';

interface PopupOTPProps extends PopupPropsTypes {
    getOTPcode?: (phone: string, channel: ItemProps, refCode: string) => any,
    onPressConfirm?: (otp: string) => any,
    onChannelPress?: () => any,
}

export const PopupOTPLogin = forwardRef<
    PopupActionTypes,
    PopupOTPProps
>(({ getOTPcode, onPressConfirm, onChannelPress }: PopupOTPProps, ref: any) => {
    const { common } = useAppStore();
    const [visible, setVisible] = useState<boolean>(false);
    const refPhone = useRef<TextFieldActions>(null);
    const [startCount, setStartCount] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(0);
    const [pin, setPin] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);
    const refOTP = useRef<any>();
    const intervalRef = useRef<any>();

    const refRefCode = useRef<TextFieldActions>(null);
    const [refCode, setRefCode] = useState<string>('');
    const [errChannel, setErrChannel] = useState<string>('');
    const [isShowReferral, setShowReferral] = useState<boolean>(false);
    const [channel, setChannel] = useState<ItemProps>({});
    const [isLoading, setLoading] = useState<boolean>(false);

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
    }, [timer, common.successGetOTP]);

    const _onCancel = useCallback(() => {
        setStartCount(true);
        setTimer(0);
        setPin('');
    }, []);

    const show = useCallback(() => {
        setPhone('');
        setPin('');
        setVisible(true);
        setTimer(60);
        setTimeout(() => {
            refPhone.current?.focus();
        }, 300);
    }, []);

    const wakeUp = useCallback(() => {
        setVisible(true);
    }, []);

    const updateChannel = useCallback((_channel: any) => {
        setChannel(_channel);
        setVisible(true);
        setTimer(60);
        setErrChannel('');

        if (_channel?.id === FRIEND_INVITE_ID) {
            setShowReferral(true);
        } else {
            setShowReferral(false);
            setRefCode('');
        }
    }, []);


    const hide = useCallback(() => {
        setVisible(false);
        setErrMsg('');
        _onCancel();
    }, [_onCancel]);

    useImperativeHandle(ref, () => ({
        show,
        hide,
        setErrorMsg,
        setErrorOTP,
        updateChannel,
        wakeUp
    }));

    useEffect(() => {
        if (pin.toString().length === 6) {
            setLoading(true);
            onPressConfirm?.(pin);
        }
    }, [pin]);

    const setErrorMsg = useCallback((err: string) => {
        setLoading(false);
        if (err) {
            if (err.toLowerCase().includes('mã')) { // FIXME: hardcode
                refRefCode.current?.setErrorMsg(err);
            } else {
                refPhone.current?.setErrorMsg(err);
            }
        } else {
            refPhone.current?.setErrorMsg('');
            refRefCode.current?.setErrorMsg('');
        }

    }, []);

    const onValidate = useCallback(() => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        refPhone.current?.setErrorMsg(errMsgPhone);

        const _errChannel = FormValidate.inputEmpty(channel?.id, Languages.errorMsg.channelRequired);
        let errRefCode = '';
        if (parseInt(channel?.id || '0', 10) === FRIEND_INVITE_ID) {
            errRefCode = FormValidate.referralValidate(refCode);
        }
        refRefCode.current?.setErrorMsg(errRefCode);

        setErrChannel(_errChannel);

        if (`${errMsgPhone}${_errChannel}${errRefCode}`.length === 0) {
            return true;
        }
        return false;
    }, [phone, channel, refCode]);

    const onConfirm = useCallback(async () => {
        if (onValidate()) {
            setLoading(true);
            await getOTPcode?.(phone, channel, refCode);
            setLoading(false);
            setStartCount(true);
            setTimer(60);
        }
    }, [getOTPcode, onValidate, phone, channel, refCode]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.auth.txtPhone:
                setPhone(value);
                break;
            case Languages.auth.txtRefCode:
                setRefCode(value);
                break;
            default:
                break;
        }
    }, []);

    const onChangeCode = useCallback((code: string) => {
        setPin(code);
        setErrMsg('');
    }, []);

    const onResend = useCallback(async () => {
        setLoading(true);
        await getOTPcode?.(phone, channel, refCode);
        setLoading(false);
        setStartCount(true);
        setTimer(60);
    }, [getOTPcode, phone, channel, refCode]);

    const renderBtConfirm = useMemo(() => (
        <Touchable onPress={onConfirm} style={styles.btConfirm}>
            {isLoading && <Loading isWhite/>}
            <Text style={[styles.txtBt, { color: COLORS.WHITE }]}>{Languages.confirmPhone.update}</Text>
        </Touchable>
    ), [onConfirm, isLoading]);

    const renderResend = useMemo(() => {
        if (startCount) {
            return (
                <View style={styles.btResend}>
                    <Text style={styles.txtBt}>{`${Utils.convertSecondToMinutes(timer)}s`}</Text>
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

    const getChannelContainer = useMemo(() => [styles.containerOverViewPicker, { borderColor: errChannel ? COLORS.RED : COLORS.GRAY_11 }], [errChannel]);

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
                    <Text style={styles.title}>{!common.successGetOTP ? Languages.otp.accuracyPhone : Languages.otp.title}</Text>
                    <Text style={styles.txt}>{!common.successGetOTP ? Languages.otp.completionPhoneLogin : Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone))}</Text>
                    {!common.successGetOTP ?
                        <>
                            <MyTextInputKeyboardNavigation
                                ref={refPhone}
                                value={phone}
                                isPhoneNumber={true}
                                maxLength={10}
                                rightIcon={arrayIcon.login.phone}
                                placeHolder={Languages.auth.txtPhone}
                                containerInput={styles.inputPhone}
                                onChangeText={onChangeText}
                                keyboardType={'NUMBER'}
                                textContentType={'telephoneNumber'}
                            />
                            <TouchableOpacity
                                onPress={onChannelPress}
                                style={getChannelContainer}
                            >
                                <Text style={styles.valuePicker}>{channel?.value || Languages.auth.knowChannel}</Text>
                                {<ICUnderArrow />}
                            </TouchableOpacity>
                            {errChannel ? <Text
                                style={styles.errorMessage}>{errChannel}</Text> : null}
                            {isShowReferral && <MyTextInputKeyboardNavigation
                                ref={refRefCode}
                                refArr={[refCode]}
                                orderRef={1}
                                value={refCode}
                                isPhoneNumber={true}
                                maxLength={10}
                                rightIcon={arrayIcon.login.referral_code}
                                placeHolder={Languages.auth.txtRefCode}
                                containerInput={styles.inputPhone}
                                onChangeText={onChangeText}
                                keyboardType={'NUMBER'}
                                textContentType={'telephoneNumber'}
                            />}
                            {renderBtConfirm}
                        </>
                        :
                        <>
                            <Animated.View style={containerStyle} >
                                <View style={styles.boxOtp}>
                                    <OtpInputs
                                        ref={refOTP}
                                        handleChange={onChangeCode}
                                        numberOfInputs={6}
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
                    }
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
        flexDirection: 'row',
        backgroundColor: COLORS.GREEN,
        borderRadius: 30,
        width: SCREEN_WIDTH * 0.7,
        height: 45,
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
        color: COLORS.RED_2,
        paddingHorizontal: 10
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
        marginHorizontal: 15,
        alignSelf: 'flex-start'
    },
    inputChannel: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '95%',
        height: Configs.FontSize.size40,
        marginTop: 10
    },
    containerOverViewPicker: {
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '95%',
        height: Configs.FontSize.size40,
        borderColor: COLORS.GRAY_11,
        paddingHorizontal: 15,
        marginTop: 10
    },
    valuePicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    containerPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15
    },
    containerPlaceholderPicker: {
    }
});
