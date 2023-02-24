import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';

import ICCalender from '@/assets/image/ic_calender.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { Touchable } from '@/components/elements/touchable';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { PopupActions } from './popupInvest/types';



export type PopupFilterProps = {
    onClose?: () => any;
    onConfirm?: (fromDate: string, toDate: string) => any;
    onChange?: (value: string, title: string) => any
    title?: string,
    openDatePicker?: (type: string) => void,
    fromDate?: string,
    toDate?: string,
    money?: string,
    openTimeInvestment?: () => void;
    onCancel?: () => void;
    isRefresh?: boolean
};


const PopupFilterInvested = forwardRef<PopupActions, PopupFilterProps>(
    ({
        onConfirm,
        title,
        money,
        openTimeInvestment,
        onCancel,
        isRefresh
    }: PopupFilterProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const [visibleFromDatePicker, setVisibleFromDatePicker] = useState<boolean>(false);
        const [visibleToDatePicker, setVisibleToDatePicker] = useState<boolean>(false);
        const [startDate, setStartDate] = useState<Date>();
        const [endDate, setEndDate] = useState<Date>();

        useEffect(() => {
            _onCancel();
        }, [isRefresh]);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            setVisibleFromDatePicker(false);
            setVisibleToDatePicker(false);
        }, []);

        const clear = useCallback(() => {
            setStartDate(undefined);
            setEndDate(undefined);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            clear
        }));

        const _onClose = useCallback(() => {
            hide();
        }, [hide]);

        const actionYes = () => {
            onConfirm?.(DateUtils.formatForServer(startDate), DateUtils.formatForServer(endDate));
            hide();
        };
        const _onCancel = useCallback(() => {
            setStartDate(undefined);
            setEndDate(undefined);
            onCancel?.();
            _onClose();
        }, [_onClose, onCancel]);

        const renderItem = useCallback((value: any, palaceholder: string,_visible?:boolean) => {
            const onPress = () => {
                if (palaceholder === Languages.invest.fromDate) {
                    setVisibleFromDatePicker(true);
                }
                if (palaceholder === Languages.invest.toDate)
                    setVisibleToDatePicker(true);
                if (palaceholder === Languages.invest.chooseMoney) {
                    openTimeInvestment?.();
                    hide();
                }
            };
            const styleTxt = {
                color: value ? COLORS.BLACK : COLORS.GRAY_16
            } as TextStyle;
            return (
                <Touchable style={styles.inputPhone} onPress={onPress}>
                    <Text style={[styles.txtPalaceholder, styleTxt]}>{value || palaceholder}</Text>
                    {!_visible&&<ICCalender />}
                </Touchable>
            );
        }, [hide, openTimeInvestment]);

        const onConfirmDatePicker = useCallback((date: Date, label?: string) => {
            if (label === Languages.invest.fromDate) {
                setStartDate(date);
            }
            if (label === Languages.invest.toDate) {
                setEndDate(date);
            }

        }, []);

        const renderDatePicker = useCallback((isVisible: boolean, date: Date, label?: string) => {

            const onConfirmPicker = (value: Date) => {
                if (label === Languages.invest.fromDate) {
                    setVisibleFromDatePicker(false);
                }
                if (label === Languages.invest.toDate) {
                    setVisibleToDatePicker(false);
                }
                onConfirmDatePicker(value, label);
            };

            return (
                <DatePicker
                    modal
                    mode='date'
                    open={isVisible}
                    locale={'vi'}
                    androidVariant={'iosClone'}
                    date={date}
                    title={label}
                    onDateChange={(value) => console.log(value)}
                    onCancel={hide}
                    onConfirm={onConfirmPicker}
                    confirmText={Languages.common.agree}
                    cancelText={Languages.common.cancel}
                />
            );
        }, [hide, onConfirmDatePicker]);

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
                    {renderItem(DateUtils.formatMMDDYYYYPicker(startDate) || '', Languages.invest.fromDate)}
                    {renderItem(DateUtils.formatMMDDYYYYPicker(endDate) || '', Languages.invest.toDate)}
                    {renderItem(money, Languages.invest.chooseMoney,visible)}
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
                {renderDatePicker(visibleFromDatePicker, startDate || new Date(), Languages.invest.fromDate)}
                {renderDatePicker(visibleToDatePicker, endDate || new Date(), Languages.invest.toDate)}
            </Modal>

        );
    }
)
    ;

export default PopupFilterInvested;
const styles = StyleSheet.create({
    textModel: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        textAlign: 'center',
        color: COLORS.GREEN_3
    },
    viewFL: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 20,
        borderWidth: 1,
        paddingBottom: 16,
        paddingTop: 10,
        width: '100%',
        paddingHorizontal: 16
    },
    inputPhone: {
        marginTop: 15,
        borderRadius: 30,
        width: '100%',
        borderWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS.GRAY_11,
        paddingLeft: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16
    },
    containerOverViewPicker: {
        marginTop: 12,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: Configs.FontSize.size40,
        borderColor: COLORS.GRAY_11
    },
    valuePicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    containerPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20
    },
    textConfirm: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.WHITE
    },
    tobConfirm: {
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 32 - 60) / 2,
        marginTop: 10
    },
    viewBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    txtPalaceholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_16
    }
}
);

