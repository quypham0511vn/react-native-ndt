import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Text, TextStyle, View } from 'react-native';
import Modal from 'react-native-modal';

import IcSelect from '@/assets/image/ic_select.svg';
import Languages from '@/common/Languages';
import { ItemProps } from '@/components/bottomSheet';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import { MyStylePupUp } from '@/components/popupInvest/styles';
import { COLORS } from '@/theme';
import { PopupActions } from './types';


export type PopupFilterProps = {
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
    openBottomSheet?: (type: string) => void,
    timeInvestment?: ItemProps,
    moneyInvestment?: ItemProps,
    onCancel?:()=>void
};


const PopupFilter = forwardRef<PopupActions, PopupFilterProps>(
    ({
        onConfirm,
        title,
        openBottomSheet,
        timeInvestment,
        moneyInvestment,
        onCancel
    }: PopupFilterProps, ref) => {

        const styles = MyStylePupUp();
        const [visible, setVisible] = useState<boolean>(false);
        const refMonth = useRef<TextFieldActions>(null);
        const refMoney = useRef<TextFieldActions>(null);

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
        }, [hide]);

        const actionYes = () => {
            onConfirm?.();
            hide();
        };

        const _onCancel =useCallback(()=>{
            _onClose();
            onCancel?.();
        },[_onClose, onCancel]);

        const onOpenBottomSheet = useCallback((type: string) => {
            hide();
            openBottomSheet?.(type);
        }, [hide, openBottomSheet]);

        const renderItem = useCallback((refItem: any, value: any, placeholder: string) => {
            const onPress = () => {
                onOpenBottomSheet(placeholder);
            };
            const styleTxt = {
                color: value ? COLORS.BLACK : COLORS.GRAY_16
            } as TextStyle;
            return (
                <Touchable style={styles.inputPhone} onPress={onPress}>
                    <Text style={[styles.txtPlaceholder, styleTxt]}>{value || placeholder}</Text>
                    <IcSelect/>
                </Touchable>
            );
        }, [onOpenBottomSheet, styles.inputPhone, styles.txtPlaceholder]);

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
                    <Text style={styles.textModel}>{title}</Text>
                    {renderItem(refMonth, timeInvestment?.value, Languages.invest.monthInvest)}
                    {renderItem(refMoney, moneyInvestment?.value, Languages.invest.chooseMoney)}
                    <View style={styles.viewBottom}>
                        <Touchable style={styles.tobConfirm} onPress={actionYes}>
                            <Text style={styles.textConfirm}>{Languages.invest.search}</Text>
                        </Touchable>
                        <Touchable style={[styles.tobConfirm, { backgroundColor: COLORS.GRAY_2 }]}
                            onPress={_onCancel}>
                            <Text
                                style={[styles.textConfirm, { color: COLORS.GRAY_12 }]}>{Languages.invest.cancel}</Text>
                        </Touchable>
                    </View>
                </View>
            </Modal>

        );
    }
)
    ;

export default PopupFilter;

