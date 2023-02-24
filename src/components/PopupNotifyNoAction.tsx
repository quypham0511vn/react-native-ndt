import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';

import { COLORS, Styles } from '@/theme';
import Languages from '@/common/Languages';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { Configs } from '@/common/Configs';
import { Touchable } from './elements/touchable';

interface PopupNoActionProps extends PopupPropsTypes {
    renderIcon?: any,
    renderTitle?: string,
    renderContent?: string,
    hasButton?: boolean,
    containerAllBtn?: ViewStyle,
    containerAgreeBtn?: ViewStyle,
    textCancel?: TextStyle,
    textAgree?: TextStyle,
    containerCancelBtn?: ViewStyle
}

const PopupNotifyNoAction = forwardRef<
    PopupActionTypes,
    PopupNoActionProps
>(({ onClose,
    onConfirm,
    renderIcon,
    renderTitle,
    renderContent,
    hasButton,
    containerAllBtn,
    containerAgreeBtn,
    textCancel,
    textAgree,
    containerCancelBtn,
    onBackdropPress
}: PopupNoActionProps, ref) => {
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
            onBackdropPress={onBackdropPress || hide}
            avoidKeyboard={true}
            hideModalContentWhileAnimating
        >
            <View style={styles.popup}>
                {renderIcon}
                <Text style={styles.txtTitle}>{renderTitle}</Text>
                <Text style={styles.txtContent}>{renderContent}</Text>
                {hasButton &&
                    <View style={[styles.row, containerAllBtn]}>
                        <Touchable style={[styles.closeButton, containerCancelBtn]} onPress={_onClose}>
                            <Text style={[styles.txtBt, textCancel]}>{Languages.common.cancel}</Text>
                        </Touchable>
                        <Touchable style={[styles.confirmButton, containerAgreeBtn]} onPress={onConfirm}>
                            <Text style={[styles.txtBtConfirm, textAgree]}>{Languages.common.agree}</Text>
                        </Touchable>
                    </View>}
            </View>
        </Modal>
    );
});

export default PopupNotifyNoAction;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_13,
        borderRadius: 16,
        borderWidth: 1,
        paddingBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingTop: 16
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GRAY_7,
        marginTop: 15
    },
    txtContent: {
        ...Styles.typography.regular,
        marginTop: 10,
        marginHorizontal: 16,
        textAlign: 'center',
        color: COLORS.GRAY_12
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10,
        paddingTop: 10
    },
    txtBt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GREEN
    },
    txtBtConfirm: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE
    },
    closeButton: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    },
    confirmButton: {
        backgroundColor: COLORS.GREEN,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    }
});
