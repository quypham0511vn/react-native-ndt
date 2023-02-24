import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { PAYMENT_URL } from '@/api/constants';
import IcSuccess from '@/assets/image/ic_successful.svg';
import { PADDING_BOTTOM } from '@/common/Configs';
import Languages from '@/common/Languages';
import { TabsName } from '@/common/screenNames';
import HeaderBar from '@/components/header';
import Loading from '@/components/loading';
import MyWebViewProgress from '@/components/MyWebViewProgress';
import PopupPaymentStatus, { PopupPaymentStatusActions } from '@/components/PopupPaymentStatus';
import Navigator from '@/routers/Navigator';

const PaymentWebview = ({ route }: any) => {

    const webProgressRef = useRef<any>(null);
    const webViewRef = useRef<WebView>(null);

    const [url] = useState<string>(route?.params?.url);
    const popupRef = useRef<PopupPaymentStatusActions>(null);

    const onLoadProgress = useCallback((e: any) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    const handleChange = (e: any) => {
        const baseUrl = e.url;
        // console.log('base', baseUrl);
        // console.log('PAYMENT_URL.NL_FAILED', PAYMENT_URL.NL_FAILED);
        if (baseUrl.indexOf(PAYMENT_URL.NL_SUCCESSFULLY) === 0) {
            popupRef.current?.show();
        } else if (baseUrl.indexOf(PAYMENT_URL.NL_FAILED) === 0) {
            Navigator.goBack();
        }
    };

    const onNavigateHistory = useCallback(() => {
        Navigator.resetScreen([TabsName.investTabs]);
        Navigator.resetScreen([TabsName.homeTabs]);
        setTimeout(() => {
            Navigator.navigateScreen(TabsName.homeTabs);
        }, 500);
    }, []);

    const renderLoading = () => <Loading isOverview />;

    const renderPopup = useMemo(() => <PopupPaymentStatus
        showBtn={false}
        icon={<IcSuccess />}
        title={Languages.invest.notify}
        content={Languages.invest.payFinished}
        ref={popupRef}
        onClose={onNavigateHistory}
    />, [onNavigateHistory]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar title={Languages.invest.title} hasBack />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MyWebViewProgress
                    ref={webProgressRef}
                />
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    onLoadProgress={onLoadProgress}
                    onNavigationStateChange={handleChange}
                    startInLoadingState
                    scalesPageToFit
                    thirdPartyCookiesEnabled={false}
                    incognito
                    cacheEnabled={false}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                    renderLoading={renderLoading}
                />
            </ScrollView>
            {renderPopup}
        </View>
    );
};

export default PaymentWebview;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
