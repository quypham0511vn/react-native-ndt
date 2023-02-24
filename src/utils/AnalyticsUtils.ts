import analytics from '@react-native-firebase/analytics';

const prefix = 'app_live_';

function trackEvent(event: string, param?: any) {
    const envEvent = `${prefix}${event}`;
    if (param) {
        analytics().logEvent(envEvent, param);
    } else {
        analytics().logEvent(envEvent);
    }
}

function trackScreen(screen: any) {
    const envScreen = `${prefix}screen_${screen}`;
    analytics().logScreenView({ screen_class: envScreen, screen_name: screen });
}

export default {
    trackEvent,
    trackScreen
};
