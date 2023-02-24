import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import { StorageKeys } from '@/common/constants';
import StorageUtils from '@/utils/StorageUtils';
import { UserInfoModal } from '@/models/user-models';
import { isIOS } from '@/common/Configs';


export const DeviceInfos = {
    DeviceName: '',
    DeviceId: DeviceInfo.getDeviceId(),
    UniqueID: DeviceInfo.getUniqueId(),
    VersionName: DeviceInfo.getVersion(),
    VersionID: DeviceInfo.getBuildNumber(),
    HasNotch: DeviceInfo.hasNotch()
};

class SessionManager {
    userInfo: UserInfoModal | undefined;

    accessToken: string | null | undefined;

    refreshToken: string | null | undefined;

    biometryType: string | null | undefined;

    isSkipOnboarding: boolean | null | undefined;

    lastTabIndexBeforeOpenAuthTab: number | undefined;

    ratingPoint!: number;

    savePhone: string | null | undefined;

    savePwd: string | null | undefined;

    isEnableFastAuthentication: boolean | null | undefined;

    // tempDataForPropertyValuation : PropertyValuationModel | undefined;

    async initData(callback: any) {
        DeviceInfos.DeviceName = await DeviceInfo.getDeviceName();

        this.lastTabIndexBeforeOpenAuthTab = 0;

        const keys = [
            StorageKeys.KEY_ACCESS_TOKEN,
            StorageKeys.KEY_USER_INFO,
            StorageKeys.KEY_SKIP_ONBOARDING,
            StorageKeys.KEY_RATE,
            StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION,
            StorageKeys.KEY_TEMP_DATA_FOR_PROPERTY_VALUATION,
            StorageKeys.KEY_SAVE_LOGIN_PHONE,
            StorageKeys.KEY_SAVE_LOGIN_PASS
        ];
        AsyncStorage.multiGet(keys, (err, stores = []) => {
            for (let i = 0; i < stores.length; i++) {
                const store = stores[i];

                if (store[0] === StorageKeys.KEY_ACCESS_TOKEN) {
                    this.accessToken = store[1];
                } else if (store[0] === StorageKeys.KEY_SKIP_ONBOARDING) {
                    try {
                        this.isSkipOnboarding = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_USER_INFO) {
                    try {
                        this.userInfo = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_RATE) {
                    try {
                        this.ratingPoint = store[1] ? JSON.parse(store[1]) : 0;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_SAVE_LOGIN_PHONE) {
                    try {
                        this.savePhone = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_SAVE_LOGIN_PASS) {
                    try {
                        this.savePwd = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                }
                else if (store[0] === StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION) {
                    try {
                        this.isEnableFastAuthentication = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }

                }
            }
            callback();
        });
    }

    async setAccessToken(token?: string) {
        if (token) {
            this.accessToken = `${token}`;
            StorageUtils.saveDataToKey(StorageKeys.KEY_ACCESS_TOKEN, this.accessToken);
        } else {
            this.accessToken = undefined;
            StorageUtils.clearDataOfKey(StorageKeys.KEY_ACCESS_TOKEN);
        }

    }

    setUserInfo(userInfo?: UserInfoModal) {
        this.userInfo = userInfo;
        if (userInfo) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_USER_INFO, JSON.stringify(this.userInfo));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_USER_INFO);
        }
    }

    setSavePhoneLogin(phone?: string) {
        this.savePhone = phone;
        if (phone) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_SAVE_LOGIN_PHONE, JSON.stringify(this.savePhone));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_SAVE_LOGIN_PHONE);
        }
    }

    setSavePassLogin(pass?: string) {
        this.savePwd = pass;
        if (pass) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_SAVE_LOGIN_PASS, JSON.stringify(this.savePwd));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_SAVE_LOGIN_PASS);
        }
    }

    getPhoneLogin() {
        return this.savePhone;
    }

    getPwdLogin() {
        return this.savePwd;
    }

    setSkipOnboarding() {
        this.isSkipOnboarding = true;
        StorageUtils.saveDataToKey(StorageKeys.KEY_SKIP_ONBOARDING, JSON.stringify(true));
    }

    getUserInfo() {
        return this.userInfo;
    }

    setRatingPoint(rate: number) {
        this.ratingPoint = rate || 0;
        if (rate) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_RATE, JSON.stringify(this.ratingPoint));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_RATE);
        }
    }

    getRatingPoint() {
        return this.ratingPoint || 0;
    }

    setEnableFastAuthentication(enable?: boolean) {
        if (enable) StorageUtils.saveDataToKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION, JSON.stringify(true));
        else StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
    }

    // setTempDataForPropertyValuation(value:any)
    // {
    //     this.tempDataForPropertyValuation=value;
    //     if(value) StorageUtils.saveDataToKey(StorageKeys.KEY_TEMP_DATA_FOR_PROPERTY_VALUATION,JSON.stringify(value));
    //     else StorageUtils.clearDataOfKey(StorageKeys.KEY_TEMP_DATA_FOR_PROPERTY_VALUATION);
    // }

    logout() {
        this.setUserInfo();
        this.setAccessToken();
        this.setRatingPoint(0);
        this.setEnableFastAuthentication();
        this.lastTabIndexBeforeOpenAuthTab = 0;
        if (isIOS) {
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        } else {
            PushNotification.setApplicationIconBadgeNumber(0);
        }
    }
}

export default new SessionManager();
