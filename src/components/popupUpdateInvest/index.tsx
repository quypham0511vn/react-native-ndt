import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { Configs } from '@/common/Configs';
import { Touchable } from '@/components/elements/touchable';
import { COLORS, Styles } from '@/theme';
import { PopupActions } from '../popup/types';

export type PopupUpdateInvestProps = {
    onClose?: () => any;
    onConfirm?: () => void;
    onChange?: (value: string, title: string) => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    description?: string;
    title?: string,
    data?: [],
    value?: string,
    icon?: any,
    labelButton?: string,
    openBottomSheet?: (type: string) => void,
    onCancel?: () => void
};

export type PopupUpdateInvestActions = {
    show: (title?: string, content?: string, labelButton?: string, onConfirm?: any, icon?: any) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
    setErrorMsg?: (msg?: string) => void;
    showAlert?: (title?: string, content?: string) => any;
};


type DataPopup = {
    icon?: any;
    title?: string;
    content?: string;
    onConfirm?: () => void;
    labelButton?: string;
}

const PopupUpdateInvest = forwardRef<PopupActions, PopupUpdateInvestProps>(
    ({ icon, title, content, labelButton, onConfirm }: PopupUpdateInvestProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const [data, setData] = useState<DataPopup>();
        const show = useCallback((_title?: string, _content?: string, _labelButton?: string, _onConfirm?: () => void, _icon?: any) => {
            setData({
                title: _title,
                content: _content,
                labelButton: _labelButton,
                onConfirm: _onConfirm,
                icon: _icon
            });
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const actionYes = () => {
            if (onConfirm) {
                onConfirm?.();
            } else {
                data?.onConfirm?.();
            }
            hide();
        };

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.viewFL}>
                    {(data?.icon || icon) && <View style={styles.viewIcon}>{icon || data?.icon}</View>}
                    <Text style={styles.textModel}>{title || data?.title}</Text>
                    <Text style={styles.content}>{content || data?.content}</Text>
                    {(labelButton || data?.labelButton) &&
                        <View style={styles.viewBottom}>
                            <Touchable style={styles.tobConfirm} onPress={actionYes}>
                                <Text style={styles.textConfirm}>{labelButton || data?.labelButton}</Text>
                            </Touchable>
                        </View>
                    }
                </View>
            </Modal>

        );
    }
);

export default PopupUpdateInvest;

const styles = StyleSheet.create({
    fillWidth: {
        flex: 1
    },
    viewFL: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 20,
        borderWidth: 1,
        paddingBottom: 16,
        paddingTop: 10,
        width: '100%',
        paddingHorizontal: '10%'
    },
    textModel: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        textAlign: 'center',
        color: COLORS.GRAY_7,
        paddingVertical: 10
    },
    viewBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        alignItems: 'center',
        marginBottom: 10
    },
    content: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size14,
        textAlign: 'center',
        color: COLORS.GRAY_12,
        paddingBottom: 10
    },
    textConfirm: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.WHITE
    },
    tobConfirm: {
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    viewIcon: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    }
}); 
