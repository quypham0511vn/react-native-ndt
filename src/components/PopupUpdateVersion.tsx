import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import ImgLogo from '@/assets/image/img_logo.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { Touchable } from '@/components/elements/touchable';
import { PopupPropsTypes } from '@/models/typesPopup';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { PopupActions } from './popup/types';

export interface PopupVerifyRequestProps extends PopupPropsTypes {
    icon?: any;
    showBtn?: boolean;
}

const PopupUpdateVersion = forwardRef<PopupActions, PopupVerifyRequestProps>(
    ({ onClose, onConfirm,  showBtn = true }: PopupVerifyRequestProps, ref) => {
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

        const _onConfirm = useCallback(() => {
            onConfirm?.();
        }, [onConfirm]);
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
                    <ImgLogo width={SCREEN_WIDTH / 3} />
                    <Text style={styles.txtTitle}>
                        {Languages.update.title}
                    </Text>
                    <Text style={styles.txtContent}>{Languages.update.description}</Text>
                    {showBtn && <View style={styles.wrapButton}>
                        <Touchable onPress={_onClose} style={styles.cancelButton}>
                            <Text style={styles.txtCancel}>{Languages.common.skip}</Text>
                        </Touchable>
                        <Touchable onPress={_onConfirm} style={styles.confirmButton}>
                            <Text style={styles.txtVerify}>{Languages.update.update}</Text>
                        </Touchable>
                    </View>}
                </View>
            </Modal>
        );
    }
);

export default PopupUpdateVersion;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 20,
        marginHorizontal: 10,
        textAlign: 'center'
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    txtContent: {
        ...Styles.typography.regular
    },
    wrapButton: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 90,
        marginTop: 20
    },
    cancelButton: {
        width: (SCREEN_WIDTH - 90) / 2,
        backgroundColor: COLORS.GRAY,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    confirmButton: {
        width: (SCREEN_WIDTH - 110) / 2,
        backgroundColor: COLORS.GREEN,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginLeft: 15
    },
    txtVerify: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size15
    },
    txtCancel: {
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size15
    }
});
