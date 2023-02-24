import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';
import { PopupActionTypes, PopupPropsTypes } from '../models/typesPopup';
import { Touchable } from './elements/touchable';
import Languages from '@/common/Languages';
import { LINKS } from '@/api/constants';

const PopupConfirmPolicy = forwardRef<
    PopupActionTypes,
    PopupPropsTypes
>(({ onClose, onConfirm }: PopupPropsTypes, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const show = useCallback(() => {
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
        show,
        hide
    }));

    const _onClose = useCallback(() => {
        hide();
        onClose?.();
    }, [hide, onClose]);

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            useNativeDriver={true}
            onBackdropPress={hide}
            avoidKeyboard={true}
            hideModalContentWhileAnimating
        >
            <View style={styles.popup}>
                <View>
                    <Text style={styles.txtTitle}>{Languages.invest.policy}</Text>
                </View>
                <WebView
                    source={{
                        uri: LINKS.POLICY_INVESTOR
                    }}
                    javaScriptEnabledAndroid={true}
                    startInLoadingState
                    scalesPageToFit
                    thirdPartyCookiesEnabled={false}
                    incognito
                    cacheEnabled={false}
                    useWebKit
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                />
                <View style={styles.bottom}>
                    <Touchable onPress={onConfirm}  style={styles.btAgree}>
                        <Text style={styles.txtAgree}>{Languages.common.agree}</Text>
                    </Touchable>
                    <Touchable onPress={_onClose} style={styles.btCancel}>
                        <Text style={styles.txtCancel}>{Languages.common.cancel}</Text>
                    </Touchable>
                </View>
            </View>
        </Modal>
    );
});

export default PopupConfirmPolicy;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 20,
        borderWidth: 1,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingTop: 10,
        paddingRight: 15,
        height:'80%'
        
    },
    bottom:{
        paddingVertical:10,
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        paddingHorizontal:16,
        alignItems:'center'
    },
    btAgree:{
        backgroundColor:COLORS.GREEN,
        paddingVertical:8,
        borderRadius:20,
        width:'45%',
        alignItems:'center',
        justifyContent:'center'
    },
    btCancel:{
        backgroundColor:COLORS.GRAY_13,
        paddingVertical:8,
        paddingHorizontal:40,
        borderRadius:20,
        width:'45%',
        alignItems:'center',
        justifyContent:'center'
    },
    txtAgree:{
        ...Styles.typography.medium,
        color:COLORS.WHITE
    },
    txtCancel:{
        ...Styles.typography.medium,
        color:COLORS.GRAY_12
    },
    txtTitle:{
        ...Styles.typography.medium,
        textAlign:'center',
        fontSize:Configs.FontSize.size16,
        marginVertical:10
    }
});
