import { ViewStyle } from 'react-native';

export enum TypeKeyBoard {
    DEFAULT = 'default',
    NUMBER = 'number-pad',
    NUMERIC = 'numeric',
    // number with dot
    DECIMAL = 'decimal-pad',
    EMAIL = 'email-address',
    PHONE = 'phone-pad'
}

export type TextFieldProps = {
    keyboardType?: keyof typeof TypeKeyBoard,
    label?: string;
    value?: string | number;
    placeHolder?: string;
    isPassword?: boolean;
    rightIcon?: string;
    disabled?: boolean;
    hasUnderline?: boolean;
    multiline?: boolean;
    maxLength?: number;
    formatPrice?: boolean;
    formatNumber?: boolean;
    formatEmail?: boolean;
    verified?: boolean;
    showRestriction?: boolean;
    priceSuffix?: string;
    placeHolderColor?: string;
    // true:  unit  vndong: 'VNĐ', false: unit dong: 'đ',
    backgroundColor?: any;
    leftIcon?: any;
    iconSize?: number;
    inputStyle?: any;
    inputStylePwDIcon?: ViewStyle,
    containerInput?: ViewStyle;
    hideIconClear?: boolean;
    minHeight?: number | string;
    maxHeight?: number | string;
    testID?: string;
    autoFocus?: boolean;
    onKeyPress?: (text: any, tag?: any) => any
    onChangeText?: (text: string, tag?: string) => any;
    onEndEditing?: (text: string, tag?: string) => any;
    onClickRightIcon?: (text: string) => any;
    onFocusCallback?: (tag?: string) => any;
    defaultValue?: string;
    isPhoneNumber?: boolean;
    autoCapitalized?: any;
    refArr?: Array<any>;
    orderRef?: number | undefined | any;
    inputAccessoryViewID?: string;
    textContentType?: string| any;
}

export type TextFieldActions = {
    setValue: (text: string | number) => void;
    fillValue: (text: string | number) => void;
    getValue: () => string;
    focus: () => void;
    blur: () => void;
    setErrorMsg: (msg?: string) => void;
};

