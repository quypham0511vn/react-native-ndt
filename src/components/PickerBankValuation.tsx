import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';
import BottomSheetComponent from './BottomSheetComponent';
import { Configs } from '@/common/Configs';
import ICUnderArrow from '@/assets/image/ic_under_arrow.svg';
import { Touchable } from './elements/touchable';
import { ItemProps } from '@/models/common-model';
import { PopupActionTypes } from '@/models/typesPopup';

type PickerProps = {
    leftIcon?: any,
    leftIconPicker?: any,
    containerStyle?: ViewStyle;
    label?: string;
    placeholder?: string;
    onPressItem?: (item: any) => void;
    value?: string;
    data?: Array<ItemProps>;
    labelStyle?: ViewStyle;
    pickerStyle?: ViewStyle;
    rightIcon?: any;
    disable?: boolean;
    hideInput?: boolean;
    hasUnderline?:boolean;
    styleText?: TextStyle;
    isIcon?:boolean;
    btnContainer?: any,
    hasDash?:boolean,
    stylePlaceholder?: TextStyle,
    hasInput?: boolean,
    wrapErrText?: ViewStyle,
    isValueBank?: boolean
};
const PickerBankValuation = forwardRef<PopupActionTypes, PickerProps>(({
    leftIcon,
    label,
    placeholder,
    onPressItem,
    value,
    data,
    labelStyle,
    pickerStyle,
    rightIcon,
    disable,
    containerStyle,
    hasUnderline,
    styleText,
    stylePlaceholder,
    btnContainer,
    hasDash,
    leftIconPicker,
    hasInput,
    wrapErrText,
    isValueBank
}: PickerProps, ref: any) => {
    useImperativeHandle(ref, () => ({
        setErrorMsg
    }));
    const bottomSheetRef = useRef<PopupActionTypes>(null);

    const [errMsg, setErrMsg] = useState<string>('');
    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);

    const openPopup = useCallback(() => {
        bottomSheetRef.current?.show();
    }, []);

    const renderValue = useMemo(() => {
        if (value) {
            setErrMsg('');
            return <Text style={styleText}>{value}</Text>;
        }
        return (
            <Text style={[styles.placeholder, stylePlaceholder]}>
                {placeholder}
            </Text>
        );
    }, [placeholder, stylePlaceholder, styleText, value]);

    const _containerStyle = useMemo(() => {
        const style = {
            backgroundColor: !disable ? COLORS.WHITE : COLORS.GRAY_2
        };
        return [styles.wrapInput, pickerStyle, style];
    }, [disable, pickerStyle]);

    const startShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [animation]);

    // generate error message
    const errorMessage = useMemo(() => {
        const paddingText = { paddingVertical: 5 };
        if (!Validate.isStringEmpty(errMsg)) {
            return <View style={[paddingText, wrapErrText]}>
                <Text
                    style={styles.errorMessage}>{errMsg}</Text>
            </View>;
        }
        return null;
    }, [errMsg, wrapErrText]);

    const setErrorMsg = useCallback((msg: string) => {
        if (Validate.isStringEmpty(msg)) {
            return;
        }
        setErrMsg(msg);
        startShake();
    }, [startShake]);

    const containerStyles = useMemo(() => {
        const style = {
            borderColor: isFocusing ? COLORS.RED : COLORS.GRAY_1
        };

        if (errMsg !== '') {
            style.borderColor = COLORS.RED;
        }

        return [hasUnderline ? styles.containerUnderLine : styles.container,
            style, { transform: [{ translateX: animation }] }];
    }, [animation, errMsg, hasUnderline, isFocusing]);
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.wrapLabel, labelStyle]}>
                {
                    label && <><Text style={styles.label}>
                        {Utils.capitalizeFirstLetter(label || '')}
                    </Text>
                    <Text style={styles.red}> *</Text></>
                }
            </View>
            <Animated.View
                style={containerStyles}
                ref={ref}
            >
                <Touchable
                    onPress={openPopup}
                    style={[_containerStyle, btnContainer]}
                    disabled={disable}
                >
                    {leftIconPicker && (
                        leftIconPicker 
                    )}
                    {renderValue} 
                    <ICUnderArrow  />
                </Touchable>
                <BottomSheetComponent
                    ref={bottomSheetRef}
                    data={data}
                    onPressItem={onPressItem}
                    hasDash={hasDash}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    hasInputSearch={hasInput}
                    title={placeholder}
                    isValueBank={isValueBank}
                />
            </Animated.View>
            {errorMessage}
        </View>
    );
});

export default PickerBankValuation;

const styles = StyleSheet.create({
    container: {
        marginBottom: -55,
        justifyContent: 'space-between'
    },
    wrapInput: {
        width: '100%',
        borderColor: COLORS.GRAY_7,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    wrapLabel: {
        flexDirection: 'row'
    },
    label: {
        ...Styles.typography.medium,
        marginBottom: 5
    },
    red: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    placeholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        paddingVertical: 1
    },
    leftIcon: {
        ...Styles.typography.regular,
        fontSize: Configs.IconSize.size18,
        color: COLORS.LIGHT_GRAY,
        marginRight: 10
    },
    errorMessage: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED
    },
    containerUnderLine: {
        justifyContent: 'center',
        paddingVertical: 0,
        height: Configs.FontSize.size40,
        borderBottomColor: COLORS.GRAY_7,
        borderBottomWidth: 1
    }
});
