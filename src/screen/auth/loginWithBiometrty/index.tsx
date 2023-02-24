import PasscodeAuth from '@el173/react-native-passcode-auth';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import TouchID from 'react-native-touch-id';
import FastImage from 'react-native-fast-image';

import AvatarIC from '@/assets/image/ic_avatar.svg';
import ArrowIc from '@/assets/image/auth/ic_arrow_left.svg';
import FaceIDIc from '@/assets/image/auth/ic_faceid.svg';
import FingerIc from '@/assets/image/auth/ic_finger.svg';
import IcLine from '@/assets/image/auth/ic_line_auth.svg';
import arrayIcon from '@/common/arrayIcon';
import { Configs } from '@/common/Configs';
import { ENUM_BIOMETRIC_TYPE, ERROR_BIOMETRIC, StorageKeys } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabNamesArray } from '@/common/screenNames';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import Loading from '@/components/loading';
import { PinCode, PinCodeT } from '@/components/pinCode';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import { UserInfoModal } from '@/models/user-models';
import Navigator from '@/routers/Navigator';
import { COLORS, HtmlStyles } from '@/theme';
import StorageUtils from '@/utils/StorageUtils';
import { MyStylesLogin } from './styles';
import HideKeyboard from '@/components/HideKeyboard';

const customTexts = {
    set: Languages.setPassCode
};

const LoginWithBiometry = observer(() => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager: fastAuthInfo
    } = useAppStore();
    const [pass, setPass] = useState<string>('');
    const [userData, setUserData] = useState<UserInfoModal>();
    const styles = MyStylesLogin();
    const refPass = useRef<TextFieldActions>(null);
    const [checked, setCheck] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (SessionManager.getPhoneLogin()) {
            setCheck(true);
        }
        if (SessionManager.getPwdLogin()) {
            setCheck(true);
        }
        autoLogin();
    }, []);

    const onLoginSuccess = useCallback(() => {
        fastAuthInfo.setEnableFastAuthentication(false);
        Navigator.navigateToDeepScreen(
            [ScreenName.tabs],
            TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]
        );
    }, [fastAuthInfo]);

    const autoLogin = useCallback(() => {
        if (fastAuthInfo.isEnableFastAuth && fastAuthInfo?.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {

            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    fastAuthInfo.setEnableFastAuthentication(false);
                    Navigator.goBack();
                })
                .catch(() => { });
        }
    }, [fastAuthInfo]);

    const onLoginOther = useCallback(() => {
        fastAuthInfo.setFocusLogin(true);
    }, [fastAuthInfo]);

    const auth = useCallback(() => {
        if (Platform.OS === 'android') {
            TouchID.authenticate(Languages.quickAuThen.description, {
                title: Languages.biometry.useFingerprint,
                imageColor: COLORS.RED,
                imageErrorColor: COLORS.RED,
                sensorDescription: Languages.biometry.useFingerPrintError,
                sensorErrorDescription: Languages.biometry.useFingerPrintManyTimesError,
                cancelTextManyTime: Languages.common.agree,
                passcodeFallback: true
            })
                .then(() => {
                    onLoginSuccess();
                })
                .catch((error: any) => {
                    if (
                        error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT ||
                        error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT_PERMANENT
                    ) {
                        bottomSheetModalRef.current?.present?.();
                    }
                });
        } else {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginSuccess();
                })
                .catch(() => { });
        }
    }, [onLoginSuccess]);

    const onChangeText = (value: string, tag?: string) => {
        switch (tag) {
            case Languages.auth.txtPass:
                setPass(value);
                break;
            default:
                break;
        }
    };

    const renderInput = useCallback((ref: any, value: string, isPhone: boolean, placeHolder: string, rightIcon?: string, keyboardType?: any, maxLength?: number, isPass?: boolean) => (
        <MyTextInput
            ref={ref}
            value={value}
            isPhoneNumber={isPhone}
            maxLength={maxLength}
            rightIcon={rightIcon}
            placeHolder={placeHolder}
            containerInput={styles.inputPhone}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            isPassword={isPass}
        />
    ), [styles.inputPhone]);


    const onLoginPhone = useCallback(async () => {
        const res = await apiServices.auth.loginPhone(SessionManager?.userInfo?.phone_number || '', pass);

        if (res.success) {
            setLoading(false);
            const resData = res.data as UserInfoModal;
            SessionManager.setAccessToken(resData?.token);
            const resInfoAcc = await apiServices.auth.getUserInfo();
            if (resInfoAcc.success) {

                fastAuthInfo.setEnableFastAuthentication(false);
                const data = resInfoAcc?.data as UserInfoModal;
                setUserData(data);
                userManager.updateUserInfo(data);
            }
            fastAuthInfo.setEnableFastAuthentication(false);
            setTimeout(() => {
                if (SessionManager.accessToken) {
                    Navigator.navigateToDeepScreen(
                        [ScreenName.tabs],
                        TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]
                    );
                }
            }, 200);
        }

    }, [apiServices.auth, fastAuthInfo, pass, userManager]);

    useEffect(() => {
    }, [isLoading, userData]);

    const renderSupportedBio = useMemo(() => {
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <Touchable onPress={auth}>
                    <FingerIc />
                </Touchable>
            );
        }
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <Touchable onPress={auth}>
                    <FaceIDIc />
                </Touchable>
            );
        }
        return null;
    }, [auth, fastAuthInfo.supportedBiometry]);

    const checkPin = useCallback(async (value: string) => {
        const pin = await StorageUtils.getDataByKey(StorageKeys.KEY_PIN);
        if (pin === value) {
            return true;
        }
        return false;
    }, []);

    const CustomBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />;

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const onLoginSuccessWithPIn = useCallback(() => {
        bottomSheetModalRef?.current?.close();
        onLoginSuccess();
    }, [onLoginSuccess]);

    const renderPinCode = useMemo(() => (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={['20%', '82%']}
            keyboardBehavior={'interactive'}
            backdropComponent={CustomBackdrop}
            animationConfigs={animationConfigs}
        >
            <View style={styles.wrapPin}>
                <PinCode
                    mode={PinCodeT.Modes.Enter}
                    visible={true}
                    options={{
                        pinLength: 4,
                        maxAttempt: 4,
                        lockDuration: 10000,
                        disableLock: false
                    }}
                    mainStyle={customStyles.main}
                    textOptions={customTexts}
                    titleStyle={customStyles.title}
                    buttonsStyle={customStyles.buttons}
                    subTitleStyle={customStyles.subTitle}
                    buttonTextStyle={customStyles.buttonText}
                    pinContainerStyle={customStyles.pinContainer}
                    checkPin={checkPin}
                    onEnterSuccess={onLoginSuccessWithPIn}
                />
            </View>
        </BottomSheetModal>
    ), [animationConfigs, checkPin, onLoginSuccessWithPIn, styles.wrapPin]);

    return (
        <HideKeyboard>
            <View style={styles.content}>
                <View style={styles.wrapLoginTxt}>
                    <Text style={styles.txtTitle}>{Languages.auth.txtLogin}</Text>
                    <IcLine />
                </View>
                {!userManager.userInfo?.avatar_user ?
                    <AvatarIC style={styles.circleWrap} />
                    :
                    <FastImage
                        style={styles.circleWrap}
                        source={{
                            uri: userManager.userInfo?.avatar_user
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                }
                <HTMLView
                    value={`<p>${Languages.loginWithBiometry.hello} <g>${userManager.userInfo?.full_name || ''}</g>` + '</p>'}
                    stylesheet={HtmlStyles || undefined} />
                <HTMLView
                    value={Languages.loginWithBiometry.description}
                    stylesheet={HtmlStyles || undefined} />
                {renderInput(refPass, pass, false, Languages.auth.txtPass, arrayIcon.login.pass, 'DEFAULT', 50, true)}
                <View style={styles.rowInfo}>
                    <Touchable onPress={onLoginOther} style={styles.checkbox}>
                        <ArrowIc />
                        <Text style={styles.txtSave}>{Languages.loginWithBiometry.loginWithOther}</Text>
                    </Touchable>
                    <View style={styles.wrapBt}>
                        <Touchable onPress={onLoginPhone}
                            style={checked ? styles.tobLogin : [styles.tobLogin, { backgroundColor: COLORS.GRAY_13 }]}>
                            <Text style={checked ? styles.txtSubmit : [styles.txtSubmit, { color: COLORS.GRAY_12 }]}>
                                {Languages.auth.txtLogin}
                            </Text>
                        </Touchable>
                        {renderSupportedBio}
                    </View>
                </View>
                {renderPinCode}
                {isLoading && <Loading isOverview />}
            </View>
        </HideKeyboard>
    );
});

const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20
    },

    title: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size32,
        fontFamily: Configs.FontFamily.medium
    },
    buttons: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        marginHorizontal: 15,
        borderColor: COLORS.GREEN,
        width: 65,
        height: 65,
        borderRadius: 35
    },
    pinContainer: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 10
    }
});
export default LoginWithBiometry;
