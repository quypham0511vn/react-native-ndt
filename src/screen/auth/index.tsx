import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, StatusBar, Text, View } from 'react-native';

import IcCloseAuth from '@/assets/image/auth/ic_close_auth.svg';
import LogoAuth from '@/assets/image/auth/logo_auth.svg';
import IcGoogleAuth from '@/assets/image/ic_login_gg.svg';
import Images from '@/assets/Images';
import { ENUM_PROVIDER, TYPE_FORMAT_HEADER_BAR, TYPE_RESIZE } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabNamesArray } from '@/common/screenNames';
import BottomSheetBasic from '@/components/BottomSheetBasic';
import { Touchable } from '@/components/elements/touchable';
import { PopupOTPLogin } from '@/components/popupOTPLogin';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import { LoginWithThirdPartyModel } from '@/models/auth';
import { ChannelModal } from '@/models/ChannelModal';
import { ItemProps } from '@/models/common-model';
import { PopupActionTypes } from '@/models/typesPopup';
import { UserInfoModal } from '@/models/user-models';
import Navigator from '@/routers/Navigator';
import Login from '@/screen/auth/login';
import SvgComponent from '@/screen/auth/SvgText';
import { COLORS } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { loginWithApple, loginWithFacebook, loginWithGoogle } from '@/utils/SociaAuth';
import ToastUtils from '@/utils/ToastUtils';
import ForgotPass from './forgotPass';
import LoginWithBiometry from './loginWithBiometrty';
import SignUp from './signUp';
import { myStylesAuth } from './styles';

const Auth = observer(({ route }: any) => {
    const styles = myStylesAuth();
    const ratio = SCREEN_HEIGHT / SCREEN_WIDTH;
    const [wid, setWid] = useState<number>(0);
    const [data, setData] = useState<LoginWithThirdPartyModel>();
    const [dataGoogle, setDataGoogle] = useState<LoginWithThirdPartyModel>();
    const [isNavigate, setIsNavigate] = useState<string>(Languages.auth.txtLogin);
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState<boolean>(false);
    const refModal = useRef<PopupActionTypes>(null);
    const refBottomSheetMoney = useRef<any>(null);

    const {
        fastAuthInfoManager: fastAuthInfo,
        common,
        apiServices,
        userManager
    } = useAppStore();

    const [dataChannel, setDataChannel] = useState<ItemProps[]>();

    const fetchData = async () => {
        const res = await apiServices.auth.getChanelSource();
        if (res.success) {
            const dataChanel = res.data as ChannelModal[];
            const temp = [] as ItemProps[];
            dataChanel?.forEach((item: any) => {
                temp.push({
                    value: item?.name,
                    id: item.type
                });
            });
            setDataChannel(temp);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiServices.auth]);

    useLayoutEffect(() => {
        if (common.successChangePass) {
            ToastUtils.showSuccessToast(Languages.auth.successChangePass);
        }
    }, [common.successChangePass]);

    useEffect(() => {
        setTimeout(() => {
            StatusBar.setBarStyle(isFocused ? TYPE_FORMAT_HEADER_BAR.LIGHT_CONTENT : TYPE_FORMAT_HEADER_BAR.DARK_CONTENT, true);
        }, 100);
    }, [isFocused]);

    useEffect(() => {
        if (route?.params) {
            setIsNavigate(route?.params.titleAuth);
        }
        screenRatio();
    }, []);

    const screenRatio = useCallback(() => {
        // console.log(SCREEN_HEIGHT, SCREEN_WIDTH, ratio);
        if (ratio <= 1.7) {
            setWid(SCREEN_WIDTH * 0.65);
        }
        else if (ratio >= 1.7 && ratio <= 2) {
            setWid(SCREEN_WIDTH * 0.71);
        } else if (ratio > 2) {
            setWid(SCREEN_WIDTH * 0.75);
        }
    }, []);

    const onNavigate = (key: string) => {
        switch (key) {
            case Languages.auth.txtLogin:
                setIsNavigate(key);
                break;
            case Languages.auth.txtSignUp:
                setIsNavigate(key);
                break;
            case Languages.auth.forgotPwd:
                setIsNavigate(key);
                break;
            default:
                break;
        }
    };

    const gotoHome = useCallback(async () => {
        Navigator.navigateToDeepScreen(
            [TabNamesArray[0]], ScreenName.home
        );
    }, []);

    const onLoginFacebook = useCallback(async () => {
        const test = await loginWithFacebook();
        console.log(test);
    }, []);

    const initUser = useCallback(
        async (type_social: string, providerId: string, email: string, name: string) => {
            setLoading(true);
            const res = await apiServices?.auth?.loginWithThirdParty(
                type_social,
                providerId,
                email,
                name
            );
            setLoading(false);
            if (res.success) {
                const dataLogin = res.data as LoginWithThirdPartyModel;
                setDataGoogle(dataLogin);
                if (dataLogin?.token) {
                    SessionManager.setAccessToken(dataLogin?.token);
                    userManager.updateUserInfo(res.data as UserInfoModal);
                    fastAuthInfo.setEnableFastAuthentication(false);
                    if (SessionManager.accessToken) {
                        if (SessionManager.accessToken) {
                            Navigator.navigateToDeepScreen(
                                [ScreenName.tabs], TabNamesArray[0]
                            );
                        }
                    }
                } else {
                    common.setSuccessGetOTP(false);
                    refModal.current?.show();
                }
            }
        }, [apiServices?.auth, common, fastAuthInfo, userManager]);

    const getOTPLogin = useCallback(async (phone: string, channel: ItemProps, refCode: string) => {
        setLoading(true);
        const resUpdate = await apiServices?.auth?.updatePhone(dataGoogle?.id || '', phone, dataGoogle?.checksum || '', channel?.id || '', refCode);
        setLoading(false);
        if (resUpdate.success) {
            const dataUpdate = resUpdate?.data as LoginWithThirdPartyModel;
            setData(dataUpdate);
            common.setSuccessGetOTP(true);
        } else {
            refModal.current?.setErrorMsg?.(resUpdate.message);
        }
    }, [apiServices?.auth, common, dataGoogle]);

    const activePhoneLogin = useCallback(async (otp: string) => {
        setLoading(true);
        const resActive = await apiServices?.auth?.activePhone(data?.id || '', otp, data?.checksum || '');
        setLoading(false);
        if (resActive.success) {
            const resData = resActive.data as LoginWithThirdPartyModel;
            refModal.current?.hide();
            common.setSuccessGetOTP(false);
            SessionManager.setAccessToken(resData?.token);
            userManager.updateUserInfo(resActive.data as UserInfoModal);
            fastAuthInfo.setEnableFastAuthentication(false);
            if (SessionManager.accessToken) {
                if (SessionManager.accessToken) {
                    setTimeout(() => {
                        Navigator.pushScreen(ScreenName.success, { isCheckLoginGoogle: true });
                    }, 500);
                }
            }
        } else {
            refModal.current?.setErrorOTP?.(resActive.message);
        }
    }, [apiServices?.auth, common, data?.checksum, data?.id, fastAuthInfo, userManager]);

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) initUser(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id, userInfo.user.email, userInfo?.user?.name || '');
    }, [initUser]);

    const onLoginApple = useCallback(async () => {
        const userInfo = await loginWithApple();
    }, []);

    const renderContent = useMemo(() => {
        switch (isNavigate) {
            case Languages.auth.txtLogin:
                if (fastAuthInfo?.isEnableFastAuth && !fastAuthInfo.isFocusLogin) return <LoginWithBiometry />;
                return <Login />;
            case Languages.auth.txtSignUp:
                return <SignUp
                    dataChannel={dataChannel} />;
            case Languages.auth.forgotPwd:
                return <ForgotPass />;
            default:
                return null;
        }
    }, [isNavigate, fastAuthInfo?.isEnableFastAuth, fastAuthInfo.isFocusLogin, dataChannel]);

    const onPressChannelForSocialSignUp = useCallback((item?: any) => {
        refModal.current?.hide();
        refBottomSheetMoney.current?.show();
    }, []);

    const onChangeChannelForSocialSignUp = useCallback((item?: any) => {
        if (item) {
            refModal.current?.updateChannel?.(item);
        } else {
            refModal.current?.wakeUp?.();
        }
    }, []);

    return (
        <ImageBackground style={styles.main} source={Images.bg_login} resizeMode={TYPE_RESIZE.STRETCH}>
            <StatusBar
                animated
                translucent
                backgroundColor={COLORS.TRANSPARENT}
            />
            <Touchable style={styles.iconClose} onPress={gotoHome}>
                <IcCloseAuth width={30} />
            </Touchable>
            <View style={styles.viewLogo}>
                <LogoAuth
                    width={SCREEN_HEIGHT * 0.2}
                    height={SCREEN_HEIGHT * 0.2}
                />
            </View>

            <View style={styles.viewSvg}>
                <SvgComponent onNavigate={onNavigate} title={isNavigate} />
            </View>
            <View style={[styles.wrapAll, { width: wid }]}>
                {renderContent}
            </View>
            <View style={styles.viewBottom}>
                <Text style={styles.txtLogin}>{Languages.auth.txtLoginWith}</Text>
                <View style={styles.viewIcon}>
                    {/* <Touchable style={styles.icon} onPress={onLoginFacebook}>
                        <IcFaceAuth />
                    </Touchable> */}
                    <Touchable style={styles.icon} onPress={onLoginGoogle} radius={30}>
                        <IcGoogleAuth />
                    </Touchable>
                    {/* {Platform.OS === 'ios' && <Touchable style={styles.icon} onPress={onLoginApple}>
                        <IcApple />
                    </Touchable>} */}

                </View>
            </View>
            <PopupOTPLogin
                getOTPcode={getOTPLogin}
                ref={refModal}
                title={Languages.otp.completionOtpLogin}
                onPressConfirm={activePhoneLogin}
                onChannelPress={onPressChannelForSocialSignUp}
            />

            <BottomSheetBasic
                ref={refBottomSheetMoney}
                data={dataChannel}
                title={Languages.auth.knowChannel}
                onPressItem={onChangeChannelForSocialSignUp}
                onClose={onChangeChannelForSocialSignUp}
            />
        </ImageBackground>
    );
});
export default Auth;
