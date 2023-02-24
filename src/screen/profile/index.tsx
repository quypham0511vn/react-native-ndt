import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';
import { AirbnbRating } from 'react-native-ratings';
import { BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import TouchID from 'react-native-touch-id';
import PasscodeAuth from '@el173/react-native-passcode-auth';
import { useIsFocused } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

import WomanIC from '@/assets/image/ic_large_woman.svg';
import IcReferral from '@/assets/image/ic_referral.svg';
import IcWallet from '@/assets/image/ic_wallet.svg';
import WarnIC from '@/assets/image/ic_warn_vimo_red_round.svg';
import ChangePwdIC from '@/assets/image/ic_change_pwd.svg';
import FaceIdIC from '@/assets/image/ic_faceid_big.svg';
import WebIC from '@/assets/image/ic_tienngay_web.svg';
import FacebookIC from '@/assets/image/ic_tienngay_fb.svg';
import PayMethodIC from '@/assets/image/ic_pay_method.svg';
import AvatarIC from '@/assets/image/ic_avatar.svg';
import ManualIC from '@/assets/image/ic_manual.svg';
import FingerIC from '@/assets/image/ic_finger.svg';
import PolicyIC from '@/assets/image/ic_policy.svg';
import PhoneIC from '@/assets/image/ic_phone.svg';
import ShareIC from '@/assets/image/ic_share.svg';
import AnswerIC from '@/assets/image/ic_answer.svg';
import LinkAccIC from '@/assets/image/ic_acc_link.svg';
import ArrowIC from '@/assets/image/ic_right_arrow.svg';
import KeyValue from '@/components/KeyValue';
import HeaderBar from '@/components/header';
import { COLORS } from '@/theme';
import { Touchable } from '@/components/elements/touchable';
import Navigator from '@/routers/Navigator';
import { Configs, isIOS } from '@/common/Configs';
import { Button } from '@/components/elements/button';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { ScreenName, TabsName } from '@/common/screenNames';
import Languages from '@/common/Languages';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import KeyToggleValue from '@/components/KeyToggleSwitch';
import { ENUM_BIOMETRIC_TYPE, ERROR_BIOMETRIC, GET_LINK_INVESTOR, LINK_TIENNGAY, messageError, STATE_VERIFY_ACC, StorageKeys } from '@/common/constants';
import PopupConfirmBiometry from '@/components/PopupConfirmBiometry';
import { PopupActionTypes } from '@/models/typesPopup';
import PopupErrorBiometry from '@/components/PopupErrorBiometry';
import { PinCode, PinCodeT } from '@/components/pinCode';
import { CustomBackdropBottomSheet } from '@/components/CustomBottomSheet';
import StorageUtils from '@/utils/StorageUtils';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { LINKS } from '@/api/constants';
import PopupNotifyNoAction from '@/components/PopupNotifyNoAction';
import PopupRating from '@/components/PopupRating';
import { MyStylesPinCodeProfile, MyStylesProfile } from './styles';
import { PopupOtpDeleteAccount } from '@/components/popupOtpDeleteAccount';
import Loading from '@/components/loading';
import { UserInfoModal } from '@/models/user-models';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const customTexts = {
    set: Languages.setPassCode
};
const configTouchId = {
    unifiedErrors: false,
    passcodeFallback: false
};
const Profile = observer(() => {
    const styles = MyStylesProfile();
    const customStyles = MyStylesPinCodeProfile();
    const { userManager, fastAuthInfoManager, apiServices, common } = useAppStore();
    const { supportedBiometry } = fastAuthInfoManager;
    const popupError = useRef<PopupActionTypes>(null);
    const [isEnabledSwitch, setIsEnabledSwitch] = useState(SessionManager?.isEnableFastAuthentication || false);
    const popupConfirm = useRef<PopupActionTypes>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });
    const [errorText, setErrorText] = useState<string>('');
    const popupLogout = useRef<PopupActionTypes>(null);
    const popupDeleteAccount = useRef<PopupActionTypes>(null);
    const popupRating = useRef<PopupActionTypes>(null);
    const [text, setText] = useState<string>('');
    const [ratingPoint, setRating] = useState<number>(userManager.userInfo?.rate || 0);
    const [ratingPointPopup, setRatingPointPopup] = useState<number>(0);
    const [isLoading, setLoading] = useState<boolean>(false);

    const isFocus = useIsFocused();

    const popupOTP = useRef<any>();

    useEffect(() => {
        if (isFocus) {
            setRating(0);
            getUserInfo();
        }
    }, [isFocus]);

    const getUserInfo = useCallback(async () => {
        const resInfoAcc = await apiServices.auth.getUserInfo();
        if (resInfoAcc.success) {
            const data = resInfoAcc?.data as UserInfoModal;
            userManager.updateUserInfo({
                ...data
            });
        }
    }, [apiServices.auth, userManager]);

    const callPhone = useCallback(() => {
        Utils.callNumber(Languages.common.hotline);
    }, []);

    const onLinkRate = useCallback(() => {
        if (isIOS) {
            return Utils.openURL(GET_LINK_INVESTOR.LINK_IOS);
        }
        return Utils.openURL(GET_LINK_INVESTOR.LINK_ANDROID);
    }, []);

    const onNavigateAccInfo = useCallback(() => Navigator.pushScreen(ScreenName.accountInfo), []);

    const onPopupLogout = useCallback(() => {
        popupLogout.current?.show();
    }, []);

    const onOpenPopupDeleteAccount = useCallback(() => {
        popupDeleteAccount.current?.show();
    }, []);

    const onAgreeLogout = useCallback(() => {
        SessionManager.logout();
        fastAuthInfoManager.setEnableFastAuthentication(false);
        userManager.updateUserInfo(undefined);
        setIsEnabledSwitch(false);
        if (isIOS) { PushNotificationIOS.setApplicationIconBadgeNumber(0); }
        else PushNotification.setApplicationIconBadgeNumber(0);
        popupLogout.current?.hide();
        Navigator.navigateToDeepScreen(
            [ScreenName.tabs], TabsName.homeTabs
        );
    }, [fastAuthInfoManager, userManager]);

    const otpDeleteAccount = useCallback(async () => {
        popupDeleteAccount.current?.hide();
        setTimeout(() => {
            popupOTP.current?.show?.();
        }, 500);
    }, []);

    const renderPopupLogout = useMemo(() => (
        <PopupNotifyNoAction
            ref={popupLogout}
            renderIcon={<WarnIC />}
            containerAllBtn={styles.containerAllBtnPopup}
            containerAgreeBtn={styles.containerItemBtnPopup}
            containerCancelBtn={styles.containerCancelBtnPopup}
            renderContent={Languages.account.logoutNotice}
            renderTitle={Languages.account.logout}
            textCancel={styles.textCancel}
            hasButton
            onConfirm={onAgreeLogout}
        />
    ), [onAgreeLogout, styles.containerAllBtnPopup, styles.containerCancelBtnPopup, styles.containerItemBtnPopup, styles.textCancel]);

    const renderDeleteAccountPopup = useMemo(() => (
        <PopupNotifyNoAction
            ref={popupDeleteAccount}
            renderIcon={<WarnIC />}
            containerAllBtn={styles.containerAllBtnPopup}
            containerAgreeBtn={styles.containerItemBtnPopup}
            containerCancelBtn={styles.containerCancelBtnPopup}
            renderContent={Languages.maintain.deleteAccountConfirm}
            renderTitle={Languages.maintain.deleteAccount}
            textCancel={styles.textCancel}
            hasButton
            onConfirm={otpDeleteAccount}
        />
    ), [otpDeleteAccount, styles.containerAllBtnPopup, styles.containerCancelBtnPopup, styles.containerItemBtnPopup, styles.textCancel]);

    const openPopupRating = useCallback(() => {
        popupRating.current?.show();
    }, []);

    const onValidateRating = useCallback(() => {
        if (ratingPointPopup !== 0) {
            return true;
        } return false;
    }, [ratingPointPopup]);

    const onToastRating = useCallback(() => {
        // ToastUtils.showSuccessToast(Languages.common.ratedNote);
    }, []);

    const onAgreeRating = useCallback(async () => {
        if (onValidateRating()) {
            setLoading(true);
            const res = await apiServices.common.ratingApp(ratingPoint, text);
            setLoading(false);
            setRatingPointPopup(0);
            if (res.success) {
                popupRating.current?.hide();
                userManager.updateUserInfo({
                    ...userManager.userInfo,
                    rate: ratingPoint
                });
                if (ratingPoint > 3) {
                    onLinkRate();
                } else {
                    ToastUtils.showSuccessToast(Languages.common.thanksRating);
                }
            }
        } else {
            popupRating.current?.hide();
            setRatingPointPopup(0);
            ToastUtils.showErrorToast(Languages.errorMsg.emptyRatingPoint);
        };
    }, [apiServices.common, onLinkRate, onValidateRating, ratingPoint, text, userManager]);

    const renderPopupRating = useMemo(() => {
        const onChangeTextComment = async (_commentText?: string) => {
            setText(_commentText || '');
        };
        const onRating = async (rating?: number) => {
            setRating(rating || 0);
            setRatingPointPopup(rating || 0);
        };
        return (
            <PopupRating
                ref={popupRating}
                onConfirm={onAgreeRating}
                onChangeTextComment={onChangeTextComment}
                ratingSwipeComplete={onRating}
                icon={isLoading && <Loading isWhite />}
            />
        );
    }, [isLoading, onAgreeRating]);

    const renderKeyValue = useCallback((title: string, leftIcon: any, hasDashBottom?: boolean) => {
        const onNavigateScreen = () => {
            switch (title) {
                case Languages.account.shareFriends:
                    Navigator.pushScreen(ScreenName.shareFriend);
                    break;
                case Languages.account.referral:
                    Navigator.pushScreen(ScreenName.referralUsers);
                    break;
                case Languages.account.changePwd:
                    Navigator.pushScreen(ScreenName.changePwd);
                    break;
                case Languages.account.accountLink:
                    Navigator.pushScreen(ScreenName.accountLink);
                    break;
                case Languages.account.useManual:
                    Navigator.pushScreen(ScreenName.myWedView,
                        {
                            title: Languages.account.useManual,
                            url: LINKS.MANUAL_INVESTOR
                        });
                    break;
                case Languages.account.answer:
                    Navigator.pushScreen(ScreenName.myWedView,
                        {
                            title: Languages.account.answer,
                            url: LINKS.AQ_INVESTOR
                        });
                    break;
                case Languages.account.payMethod:
                    if (common.appConfig?.vimo_link) {
                        Navigator.pushScreen(ScreenName.paymentMethod);
                    } else {
                        Navigator.pushScreen(ScreenName.accountBank);
                    }
                    break;
                case Languages.account.hotline:
                    callPhone();
                    break;
                case Languages.account.policy:
                    Navigator.pushScreen(ScreenName.myWedView,
                        {
                            title: Languages.account.policy,
                            url: LINKS.POLICY_INVESTOR
                        });
                    break;
                case Languages.account.web:
                    Utils.openURL(LINK_TIENNGAY.LINK_TIENNGAY_WEB);
                    break;
                case Languages.account.facebook:
                    Utils.openURL(LINK_TIENNGAY.LINK_TIENNGAY_FACEBOOK);
                    break;
                case Languages.account.linkWallet:
                    Navigator.pushScreen(ScreenName.linkWallet);
                    break;
                default:
                    break;
            }
        };
        return (
            <KeyValue
                title={title}
                hasDashBottom={!hasDashBottom}
                rightIcon={<ArrowIC />}
                leftIcon={leftIcon}
                styleTitle={styles.txtTitleKeyValue}
                onPress={onNavigateScreen}
                containerContent={styles.featureContainer}
            />
        );
    }, [callPhone, styles.featureContainer, styles.txtTitleKeyValue, common.appConfig]);

    const onToggleBiometry = useCallback(
        (value: any) => {
            if (value)
                TouchID.isSupported(configTouchId)
                    .then(() => {
                        popupConfirm.current?.show();
                    })
                    .catch((error) => {
                        console.log(error);
                        let message;
                        if (isIOS) {
                            if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
                                message = messageError(ERROR_BIOMETRIC.ErrorFaceId);
                            }
                            if (
                                supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID &&
                                !message
                            ) {
                                message = messageError(ERROR_BIOMETRIC.LAErrorTouchIDLockout);
                            } else {
                                message = messageError(ERROR_BIOMETRIC.NOT_ENROLLED);
                            }
                        } else {
                            message = messageError(error.code);
                        }
                        setErrorText(message || '');
                        popupError.current?.show();
                    });
            else {
                StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
                setIsEnabledSwitch(false);
            }
        },
        [supportedBiometry]
    );

    const onConfirm = useCallback(() => {
        if (isIOS) {
            popupConfirm?.current?.hide?.();
            PasscodeAuth.authenticate(
                supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
                    ? Languages.quickAuThen.useFaceID
                    : Languages.quickAuThen.useTouchID
            )
                .then(() => {
                    SessionManager.setEnableFastAuthentication(true);
                    setIsEnabledSwitch(true);
                })
                .catch(() => { });
        } else {
            popupConfirm?.current?.hide?.();
            bottomSheetModalRef.current?.present?.();
        }
    }, [supportedBiometry]);

    const onSetPinCodeSuccess = useCallback(
        (pin: string) => {
            bottomSheetModalRef.current?.close?.();
            SessionManager.setEnableFastAuthentication(true);
            StorageUtils.saveDataToKey(StorageKeys.KEY_PIN, pin);
            setIsEnabledSwitch(true);
            const message =
                supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
                    ? Languages.quickAuThen.successAddFaceId
                    : Languages.quickAuThen.successAddTouchId;
            ToastUtils.showMsgToast(message);
        },
        [supportedBiometry]
    );

    const popupUpdatePassCode = useMemo(() => (
        <PopupConfirmBiometry
            ref={popupConfirm}
            type={supportedBiometry}
            onConfirm={onConfirm}
        />
    ), [onConfirm, supportedBiometry]);

    const renderPopupError = useMemo(() => <PopupErrorBiometry
        typeSupportBiometry={supportedBiometry}
        ref={popupError}
    />, [supportedBiometry]);

    const renderAuthnFinger = useMemo(() => {
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <KeyToggleValue
                    label={Languages.account.loginWithFinger}
                    isEnabledSwitch={isEnabledSwitch}
                    onToggleSwitch={onToggleBiometry}
                    hasDash
                    leftIcon={<FingerIC />}
                />
            );
        }
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <KeyToggleValue
                    label={Languages.account.loginWithFaceId}
                    isEnabledSwitch={isEnabledSwitch}
                    onToggleSwitch={onToggleBiometry}
                    hasDash
                    leftIcon={<FaceIdIC width={Configs.IconSize.size18} height={Configs.IconSize.size18} />}
                />
            );
        }
        return null;

    }, [isEnabledSwitch, onToggleBiometry, supportedBiometry]);

    const renderAccuracy = useMemo(() => {
        switch (userManager.userInfo?.tinh_trang?.status) {
            case STATE_VERIFY_ACC.VERIFIED:
                return (
                    <View style={styles.accuracyWrap}>
                        <Text style={styles.txtAccuracy}>{Languages.account.accVerified}</Text>
                    </View>
                );
            case STATE_VERIFY_ACC.NO_VERIFIED:
                return (
                    <View style={styles.notAccuracyWrap}>
                        <Text style={styles.txtNotAccuracy}>{Languages.account.accuracyNow}</Text>
                    </View>
                );
            case STATE_VERIFY_ACC.WAIT:
                return (
                    <View style={styles.waitAccuracyWrap}>
                        <Text style={styles.txtWaitAccuracy}>{Languages.account.waitVerify}</Text>
                    </View>
                );
            default:
                return (
                    <View style={styles.notAccuracyWrap}>
                        <Text style={styles.txtNotAccuracy}>{Languages.account.accuracyNow}</Text>
                    </View>
                );
        }
    }, [styles.accuracyWrap, styles.notAccuracyWrap, styles.txtAccuracy, styles.txtNotAccuracy, styles.txtWaitAccuracy, styles.waitAccuracyWrap, userManager.userInfo?.tinh_trang?.status]);

    const renderPinCode = useMemo(() => (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={['20%', '82%']}
            keyboardBehavior={'interactive'}
            backdropComponent={CustomBackdropBottomSheet}
            animationConfigs={animationConfigs}
            style={{ backgroundColor: COLORS.TRANSPARENT }}
        >
            <View style={styles.wrapPin}>
                <PinCode
                    mode={PinCodeT.Modes.Set}
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
                    onSetSuccess={onSetPinCodeSuccess}
                />
            </View>
        </BottomSheetModal>
    ), [animationConfigs, customStyles.buttonText, customStyles.buttons, customStyles.main, customStyles.pinContainer, customStyles.subTitle, customStyles.title, onSetPinCodeSuccess, styles.wrapPin]);

    const renderViewRating = useMemo(() => (
        <Touchable style={styles.feedBack}
            onPress={userManager.userInfo?.rate!! > 3 ? onToastRating : openPopupRating}
            disabled={userManager.userInfo?.rate!! > 3}
        >
            <View style={styles.starLeft}>
                <Text style={styles.textTitleFeed}>{Languages.common.yourRate}</Text>
                <Text style={styles.textTitleDescriptionFeed}>{userManager.userInfo?.rate ? Languages.common.descriptionRated : Languages.common.descriptionRating}</Text>
                <AirbnbRating
                    count={5}
                    defaultRating={userManager.userInfo?.rate}
                    size={20}
                    showRating={false}
                    isDisabled={false}
                />
            </View>
            <WomanIC />
        </Touchable>
    ), [onToastRating, openPopupRating, styles.feedBack, styles.starLeft, styles.textTitleDescriptionFeed, styles.textTitleFeed, userManager.userInfo?.rate]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.account.title} isLight={false} />
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <Touchable style={styles.accContainer} onPress={onNavigateAccInfo}>
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
                    <View style={styles.wrapNameVerify}>
                        <View style={styles.headerAccRight}>
                            <Text style={styles.headerAccName}>{userManager.userInfo?.full_name || ''}</Text>
                            <Text style={styles.headerAccPhone}>{userManager.userInfo?.phone_number || ''}</Text>
                            {renderAccuracy}
                        </View>
                        <ArrowIC />
                    </View>
                </Touchable>
                <View style={styles.containerPayMethodFeature}>
                    {common.appConfig?.vimo_link && renderKeyValue(Languages.account.linkWallet, <IcWallet />)}
                    {renderKeyValue(Languages.account.payMethod, <PayMethodIC />, true)}
                </View>
                <View style={styles.containerFeature}>
                    {renderKeyValue(Languages.account.changePwd, <ChangePwdIC />)}
                    {renderAuthnFinger}
                    {renderKeyValue(Languages.account.accountLink, <LinkAccIC />, true)}
                </View>
                <View style={styles.containerFeature}>
                    {renderKeyValue(Languages.account.policy, <PolicyIC />)}
                    {renderKeyValue(Languages.account.shareFriends, <ShareIC />)}
                    {renderKeyValue(Languages.account.referral, <IcReferral />)}
                    {renderKeyValue(Languages.account.web, <WebIC />)}
                    {renderKeyValue(Languages.account.facebook, <FacebookIC />)}
                    {renderKeyValue(Languages.account.useManual, <ManualIC />)}
                    {renderKeyValue(Languages.account.answer, <AnswerIC />)}
                    {renderKeyValue(Languages.account.hotline, <PhoneIC />, true)}
                </View>
                {renderViewRating}
                <Button label={`${Languages.account.logout}`}
                    style={styles.wrapBtn}
                    buttonStyle={BUTTON_STYLES.GRAY_RED}
                    onPress={onPopupLogout}
                    isLowerCase
                />
                {isIOS && <Button label={`${Languages.maintain.deleteAccount}`}
                    style={styles.wrapBtn}
                    buttonStyle={BUTTON_STYLES.GRAY_RED}
                    onPress={onOpenPopupDeleteAccount}
                    isLowerCase
                />}

                <Text style={styles.version}>{Languages.common.version}</Text>
            </ScrollView>
            {popupUpdatePassCode}
            {renderPopupError}
            {renderPinCode}
            {renderDeleteAccountPopup}
            {renderPopupLogout}
            {renderPopupRating}

            <PopupOtpDeleteAccount
                ref={popupOTP}
                title={Languages.maintain.completionOtpDelete}
                onConfirm={onAgreeLogout}
            />
        </View>
    );
});
export default Profile;
