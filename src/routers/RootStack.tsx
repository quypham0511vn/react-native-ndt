import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import TouchID from 'react-native-touch-id';

import { ENUM_BIOMETRIC_TYPE, ERROR_BIOMETRIC, Events } from '@/common/constants';
import { useAppStore } from '@/hooks';
import SessionManager, { DeviceInfos } from '@/manager/SessionManager';
import Auth from '@/screen/auth';
import { SuccessSignUp } from '@/screen/auth/signUp/successSignUp';
import Splash from '@/screen/splash';
import { ScreenName } from '../common/screenNames';
import MyBottomTabs from './MyBottomBar';
import { EventEmitter } from '@/utils/EventEmitter';
import Broadening from '@/screen/broadening';
import Navigator from './Navigator';

const screenOptions = { headerShown: false };
const Stack = createNativeStackNavigator();

export const isIOS = Platform.OS === 'ios';

const RootStack = observer(() => {
    const { fastAuthInfoManager, userManager } = useAppStore();

    const getSupportedBiometry = useCallback(() => {

        if (SessionManager.isEnableFastAuthentication) {
            fastAuthInfoManager.setEnableFastAuthentication(true);
        }
        if (isIOS && DeviceInfos.HasNotch) {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.FACE_ID);
        }
        else {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
        }
        if (!isIOS) {
            TouchID.isSupported()
                .then((biometricType) => {
                    if (biometricType) {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                })
                .catch((error) => {
                    if (error?.code === ERROR_BIOMETRIC.NOT_SUPPORTED) {
                        fastAuthInfoManager.setSupportedBiometry('');
                    } else {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                });
        }
    }, [fastAuthInfoManager]);

    useEffect(() => {
        getSupportedBiometry();
    }, []);

    const forceLogout = useCallback(() => {
        SessionManager.logout();
        userManager.updateUserInfo(undefined);
        Navigator.pushScreen(ScreenName.authStack);
    }, [userManager]);

    useEffect(() => {
        EventEmitter.addListener(Events.LOGOUT, forceLogout);
        return () => EventEmitter.removeListener(Events.LOGOUT, forceLogout);
    }, [forceLogout]);


    const AuthStack = useCallback(() => (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenName.auth} component={Auth} />
            <Stack.Screen name={ScreenName.success} component={SuccessSignUp} />
        </Stack.Navigator>
    ), []);

    const AppStack = useCallback(() => (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenName.splash} component={Splash} />
            <Stack.Screen name={ScreenName.onBoard} component={Broadening} />
            <Stack.Screen name={ScreenName.authStack} component={AuthStack} />
            <Stack.Screen name={ScreenName.tabs} component={MyBottomTabs} />
        </Stack.Navigator>
    ), [AuthStack]);

    const renderRootStack = useMemo(() => <AppStack />, [AppStack]);
    return renderRootStack;
});
export default RootStack;

