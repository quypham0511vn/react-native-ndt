import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { PopupActions, PopupProps } from './types';
import {MyStylePupUpStatus} from '@/components/popupStatus/styles';

const styles = MyStylePupUpStatus();
const PopupStatus = forwardRef<PopupActions, PopupProps>(
    ({
        title,
        description
    }: PopupProps, ref) => {
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
                    <Text style={styles.txtTitle}>{title}</Text>
                    <Text
                        style={styles.txtContent}
                    >
                        {description}
                    </Text>
                </View>
            </Modal>
        );
    });

export default PopupStatus;

