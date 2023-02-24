import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import PushNotification from 'react-native-push-notification';

import { isIOS } from '@/common/Configs';
import ScreenName from '@/common/screenNames';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import { NotificationTotalModel } from '@/models/notification';
import Navigator from '@/routers/Navigator';
import Utils from '@/utils/Utils';

const NotificationListening = observer(({ children }: any) => {
    const { apiServices, notificationManager, userManager } =
        useAppStore();

    const onLocalNotificationIOS = (notification: any) => {
        const isClicked = notification.getData().userInteraction === 1;
        if (isClicked) {
            navigateNotify();
        }
    };

    const navigateNotify = useCallback(() => {
        if (userManager?.userInfo) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenName.notifyInvest);
            }, 200);
        } else {
            Navigator.navigateToDeepScreen([ScreenName.authStack], ScreenName.auth);
        }
    }, [userManager?.userInfo]);

    const createToken = useCallback(async () => {
        const fcmToken = await Utils.getFcmToken();
        if (fcmToken && SessionManager.accessToken) {
            apiServices?.notification?.createFcmToken(fcmToken);
        }
    }, [apiServices?.notification]);

    const getUnreadNotify = useCallback(async () => {
        if (userManager.userInfo) {
            const res = await apiServices.notification?.getUnreadNotify();
            if (res.success) {
                const data = res.data as NotificationTotalModel;
                console.log('count unread notification', data?.total_unRead);
                notificationManager.setUnReadNotifyCount(data?.total_unRead);
                if (isIOS) { PushNotificationIOS.setApplicationIconBadgeNumber(data?.total_unRead); }
                else PushNotification.setApplicationIconBadgeNumber(data?.total_unRead);
            }
        }
    }, [apiServices.notification, notificationManager, userManager.userInfo]);

    const pushNotificationLocal = useCallback(
        async (remoteMessage: any) => {
            if (isIOS) {
                PushNotificationIOS.addNotificationRequest({
                    id: 'notificationWithSound',
                    title: remoteMessage?.notification?.title,
                    body: remoteMessage?.notification?.body,
                    sound: 'customSound.wav'
                });
            } else {
                PushNotification.localNotification({
                    id: 'notificationWithSound',
                    autoCancel: true,
                    channelId: 'TienNgay.vn-chanel',
                    showWhen: true,
                    title: remoteMessage?.notification?.title,
                    message: remoteMessage?.notification?.body,
                    vibrate: true,
                    vibration: 300,
                    playSound: true,
                    soundName: 'default'
                });
            }
        }, []);

    useEffect(() => {
        Utils.configNotification(navigateNotify);
        if (isIOS) {
            PushNotificationIOS.addEventListener(
                'localNotification',
                onLocalNotificationIOS
            );
        }
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            pushNotificationLocal(remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => { });
        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage) {
                navigateNotify();
            }
        });
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    navigateNotify();
                }
            });
        return unsubscribe;
    }, []);

    useEffect(() => {
        createToken();
        getUnreadNotify();
    }, [userManager?.userInfo?.phone_number]);

    return <>{children}</>;
});

export default NotificationListening;
