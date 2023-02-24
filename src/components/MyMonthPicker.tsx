import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { DatePickerProps } from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';

import ICCalender from '@/assets/image/ic_calender.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { useAppStore } from '@/hooks';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { Touchable } from './elements/touchable';

interface DatePickerTransactionProps extends DatePickerProps {
    title?: string;
    onConfirmDatePicker?: (date: Date, tag?: string) => void;
    onCancelDatePicker?: () => void;
    onDateChangeDatePicker?: (date: Date, tag?: string) => void;
    placeHolderStyle?: TextStyle;
    containerDate?: ViewStyle;
    errMessage?: string;
    disabled?: boolean;
}

type DatePickerTransactionActions = {
    show?: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
};

const MyMonthPicker = forwardRef<DatePickerTransactionActions, DatePickerTransactionProps>(
    (
        {
            title,
            onConfirmDatePicker,
            onDateChangeDatePicker,
            maximumDate,
            minimumDate,
            onCancel,
            date,
            placeHolderStyle,
            containerDate,
            errMessage,
            disabled
        }: DatePickerTransactionProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [dateValue, setDateValue] = useState<Date | string | undefined | number | any>();
        const { common } = useAppStore();

        useEffect(() => {
            if (common.isFocused || common.refresh) {
                date = new Date();
                onConfirmDatePicker?.('', title);
                setDateValue(null);
            }
        }, [common.isFocused, common.refresh]);

        const show = useCallback(() => {
            common.setRefresh(false);
            setVisible(true);
        }, [common]);

        const hide = useCallback(() => {
            setVisible(false);
            onCancel?.();
        }, [onCancel]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const onChange = useCallback(
            (event: string, newDate: Date) => {
                onDateChangeDatePicker?.(date || '', title || '');
            },
            [date, onDateChangeDatePicker, title]
        );

        const onConfirm = useCallback(
            (value: Date) => {
                setDateValue?.(value || title);
                onConfirmDatePicker?.(value || '', title || '');
                hide?.();
            },
            [hide, onConfirmDatePicker, title]
        );

        return (
            <>
                <Touchable style={[styles.itemPicker, containerDate]} onPress={show} disabled={disabled}>
                    <Text style={[styles.placeholderDate, placeHolderStyle]}>
                        {dateValue && !common.refresh ? DateUtils.formatMMDDYYYYPicker(dateValue) : title}
                    </Text>
                    <ICCalender />
                </Touchable>
                {!!errMessage && <Text style={styles.errText}>{errMessage}</Text>}

                {visible && <MonthPicker
                    onChange={onChange}
                    value={date}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    locale="vi"
                    okButton={Languages.common.agree}
                    cancelButton={Languages.common.cancel}
                />}
            </>
        );
    }
);

export default MyMonthPicker;

const styles = StyleSheet.create({
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (SCREEN_WIDTH - 60) / 2,
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 45,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },
    placeholderDate: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12
    },
    errText: {
        ...Styles.typography.medium,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size12,
        paddingLeft: 10,
        marginTop: 4
    }
});
