import appsFlyer from 'react-native-appsflyer';
import {Platform} from 'react-native';

// events
export const AF_FIRST_OPEN = 'af_first_open';
export const AF_REGISTRATION = 'af_registration';

const initOptions = {
    isDebug: false,
    devKey: 'Y6xaWqoyQeAqgCSfL4934T',
    onInstallConversionDataListener: true,
    timeToWaitForATTUserAuthorization: 5,
    onDeepLinkListener: true,
    appId: '1563318851'
};

// AppsFlyer initialization flow. ends with initSdk.
export function AFInit() {
    if (Platform.OS === 'ios') {
        appsFlyer.setCurrentDeviceLanguage('EN');
    }
    // appsFlyer.setAppInviteOneLinkID('oW4R');
    appsFlyer.initSdk(initOptions, null, null);
}

// Sends in-app events to AppsFlyer servers. name is the events name ('simple event') and the values are a JSON ({info: 'fff', size: 5})
export function AFLogEvent(name:string, values:any) {
    appsFlyer.logEvent(name, values, null, null);
}
