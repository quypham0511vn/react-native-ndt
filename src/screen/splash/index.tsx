import remoteConfig from '@react-native-firebase/remote-config';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import VersionCheck from 'react-native-version-check';

import { isIOS } from '@/common/Configs';
import ScreenNames, { ScreenName } from '@/common/screenNames';
import { HeaderBar } from '@/components/header';
import PopupMaintain from '@/components/PopupMaintain';
import PopupUpdateVersion from '@/components/PopupUpdateVersion';
import SessionManager from '@/manager/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import Navigator from '@/routers/Navigator';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import { useAppStore } from '@/hooks';
import ImgLogo from '@/assets/image/img_logo.svg';
import Loading from '@/components/loading';

const Splash = observer(() => {
    const { apiServices, common } = useAppStore();
    const storeUrlRef = useRef<string>();
    const popupAlert = useRef<PopupActionTypes>(null);
    const popupMaintainRef = useRef<PopupActionTypes>(null);

    const nextScreen = useCallback(async () => {
        setTimeout(async () => {
            if (SessionManager.isSkipOnboarding) {
                Navigator.replaceScreen(ScreenName.tabs);
            } else {
                Navigator.replaceScreen(ScreenNames.onBoard);
            }
        }, 1e3);
    }, []);

    const fetchRemoteConfig = useCallback(async () => {
        await remoteConfig().fetch(5);
        const activated = await remoteConfig().fetchAndActivate();

        if (activated) {
            const isMaintenance = remoteConfig().getValue(isIOS ? 'ios_isMaintenance' : 'android_isMaintenance');

            if (isMaintenance.asBoolean() === true) {
                popupMaintainRef.current?.show();
            } else {
                nextScreen();
            }
        } else {
            nextScreen();
        }
    }, [nextScreen]);

    const fetchAppConfig = useCallback(async () => {
        const config = await apiServices.common.getAppConfig();

        common.setAppConfig(config.data);
        fetchRemoteConfig();
    }, [nextScreen]);

    const checkUpdateApp = useCallback(async () => {
        VersionCheck.needUpdate({
            provider: isIOS ? 'appStore' : 'playStore',
            packageName: DeviceInfo.getBundleId(),
            currentVersion: DeviceInfo.getVersion(),
            country: 'vn'
        }).then(async (res: any) => {
            if (res && res.isNeeded) {
                storeUrlRef.current = res.storeUrl;
                popupAlert.current?.show();
            } else {
                fetchAppConfig();
            }
        });
    }, []);

    useEffect(() => {
        checkUpdateApp();
    }, []);

    const onSkip = useCallback(() => {
        nextScreen();
    }, [nextScreen]);

    const onUpdate = useCallback(() => {
        if (storeUrlRef.current) {
            Utils.openURL(storeUrlRef.current);
        } else {
            onSkip();
        }
    }, [onSkip]);

    const popupVerifyRequest = useMemo(() => (
        <PopupUpdateVersion
            onConfirm={onUpdate}
            onClose={onSkip}
            ref={popupAlert}
        />
    ), [onSkip, onUpdate]);

    const onQuit = useCallback(() => {
        popupMaintainRef?.current?.hide();
        RNExitApp.exitApp();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar
                noHeader
                barStyle />

            <ImgLogo
                style={styles.imgLogo}
            />
            {popupVerifyRequest}
            <PopupMaintain
                onConfirm={onQuit}
                onClose={onQuit}
                ref={popupMaintainRef}
            />
            <View style={styles.loadingWrap}>
                <Loading isOverview />
            </View>
        </View>
    );
});

export default Splash;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    imgLogo: {
        width: SCREEN_WIDTH - 100,
        alignSelf: 'center',
        marginBottom: SCREEN_HEIGHT / 5
    },
    loadingWrap: {
        marginBottom: -20
    }
});
