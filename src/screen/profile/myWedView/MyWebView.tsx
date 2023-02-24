import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import WebView from 'react-native-webview';

import MyWebViewProgress from '@/components/MyWebViewProgress';
import { PADDING_BOTTOM } from '@/common/Configs';
import HeaderBar from '@/components/header';

const MyWebView = ({ route }: any) => {
    const webProgressRef = useRef<any>(null);
    const webViewRef = useRef<WebView>(null);

    const onLoadProgress = useCallback((e: any) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar
                hasBack
                title={route?.params?.title}
            />
            <MyWebViewProgress
                ref={webProgressRef}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <WebView
                    ref={webViewRef}
                    source={route?.params?.url ? { uri: route?.params?.url } : { html: route?.params?.content }}
                    javaScriptEnabled={true}
                    onLoadProgress={onLoadProgress}
                />
            </ScrollView>
        </View>
    );
};

export default MyWebView;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
