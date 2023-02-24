import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { Animated, TextInput, View, Text } from 'react-native';

import { isIOS } from '../../../common/Configs';
import { COLORS } from '../../../theme';
import Validate from '@/utils/Validate';
import { myTextFieldStyle } from './styles';
import { Touchable } from '../touchable';
import { TextFieldActions, TextFieldProps, TypeKeyBoard } from './types';
import arrayIcon from '@/common/arrayIcon';
import IcPhone from '@/assets/image/auth/ic_phone_auth.svg';
import IcPass from '@/assets/image/auth/ic_pass_auth.svg';
import IcEmailAuth from '@/assets/image/auth/ic_email_auth.svg';
import IcName from '@/assets/image/auth/ic_name_auth.svg';
import IcHidePass from '@/assets/image/auth/ic_hide_pass.svg';
import IcShowPass from '@/assets/image/auth/ic_show_pass.svg';
import IcSearch from '@/assets/image/ic_search.svg';
import ICUnderArrow from '@/assets/image/ic_under_arrow.svg';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';

export const MyTextInput = forwardRef<TextFieldActions, TextFieldProps>(
    (
        {
            keyboardType = 'DEFAULT',
            value,
            placeHolder,
            isPassword,
            disabled,
            inputStyle,
            onChangeText,
            onEndEditing,
            maxLength,
            multiline,
            leftIcon,
            onFocusCallback,
            containerInput,
            rightIcon,
            testID,
            autoFocus,
            onKeyPress,
            placeHolderColor,
            defaultValue,
            autoCapitalized
        }: TextFieldProps,
        ref?: any
    ) => {
        useImperativeHandle(ref, () => ({
            setValue,
            fillValue,
            getValue,
            focus,
            blur,
            setErrorMsg
        }));

        const [isFocusing, setFocus] = useState<boolean>(false);
        const [textfieldVal, setTextfieldVal] = useState<string>(`${value || ''}`);
        const [errMsg, setErrMsg] = useState<string>('');
        const [iconPass, setIconPass] = useState<boolean>(true);
        const [animation] = useState(new Animated.Value(0));
        const styles = myTextFieldStyle();


        const orgTextInput = useRef<TextInput>(null);

        const defInputProps = {
            keyboardType:
                TypeKeyBoard[
                    keyboardType === 'NUMBER'
                        ? isIOS
                            ? keyboardType
                            : 'NUMERIC'
                        : keyboardType
                ],
            editable: !disabled
        };

        useEffect(() => {
            if (onChangeText) {
                onChangeText(textfieldVal, placeHolder || testID);
            }
        }, [onChangeText, placeHolder, testID, textfieldVal, value]);

        const getValue = useCallback(() => textfieldVal.trim(), [textfieldVal]);

        const setValue = useCallback(
            (text: any) => {
                if (maxLength) {
                    text = `${text}`.slice(0, maxLength);
                }
                setTextfieldVal(text);
                setErrMsg('');
            },
            [maxLength]
        );

        const fillValue = useCallback(
            (text: any) => {
                setValue(text);
            },
            [setValue]
        );

        useEffect(() => {
            if (!Validate.isEmpty(value)) {
                setValue(value);
            }
        }, [setValue, value]);

        const focus = useCallback(() => {
            if (orgTextInput.current) {
                orgTextInput.current?.focus();
            }
        }, []);

        const blur = useCallback(() => {
            if (orgTextInput.current) {
                orgTextInput.current?.blur();
            }
        }, []);

        const eventTextChange = useCallback(
            (text: string) => {
                setValue(text);
            },
            [setValue]
        );

        const eventEndEditing = useCallback(() => {
            if (onEndEditing) {
                onEndEditing(`${textfieldVal}`, placeHolder || testID);
            }
        }, [onEndEditing, placeHolder, textfieldVal, testID]);

        const onFocus = useCallback(() => {
            onFocusCallback?.(placeHolder);
            setFocus(true);
        }, [onFocusCallback, placeHolder]);

        const onBlur = useCallback(() => {
            setFocus(false);
        }, []);

        const containerStyle = useMemo(() => {
            const borderStyle = {
                borderColor: isFocusing ? COLORS.GREEN : COLORS.GRAY_2
            };

            const style = {
                backgroundColor: disabled ? COLORS.GRAY_2 : COLORS.WHITE
            };

            const backgroundStyle = {
                backgroundColor: isFocusing ? COLORS.WHITE : COLORS.GRAY_2
            };

            if (errMsg !== '') {
                borderStyle.borderColor = COLORS.RED;
            }
            return [styles.container, borderStyle, backgroundStyle, style, containerInput, { transform: [{ translateX: animation }] }];
        }, [animation, containerInput, disabled, errMsg, isFocusing, styles.container]);

        const _inputStyle = useMemo(
            () => inputStyle || styles.inputFont,
            [styles.inputFont, inputStyle]
        );

        const startShake = useCallback(() => {
            Animated.sequence([
                Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
            ]).start();
        }, [animation]);

        const errorMessage = useMemo(() => {
            const paddingText = { marginTop: - SCREEN_HEIGHT * 0.01 };
            if (!Validate.isStringEmpty(errMsg)) {
                return <View style={paddingText}>
                    <Text
                        style={styles.errorMessage}>{errMsg}</Text>
                </View>;
            }
            return null;
        }, [errMsg, styles.errorMessage]);

        const setErrorMsg = useCallback((msg: string) => {
            if (Validate.isStringEmpty(msg)) {
                return;
            }
            setErrMsg(msg);
            startShake();
        }, [startShake]);

        const checkIconPass = useCallback(() => {
            setIconPass(!iconPass);
        }, [iconPass]);

        const checkIconRight = useMemo(() => {
            switch (rightIcon) {
                case arrayIcon.login.phone:
                    return <IcPhone width={20} height={20} />;
                case arrayIcon.login.pass:
                    if (value) {
                        return (
                            <Touchable onPress={checkIconPass}>
                                {iconPass ? <IcHidePass width={20} height={20} /> : <IcShowPass width={20} height={20} />}
                            </Touchable>
                        );
                    }
                    return <IcPass width={20} height={20} />;
                case arrayIcon.login.email:
                    return <IcEmailAuth width={20} height={20} />;
                case arrayIcon.login.confirmPass:
                    if (value) {
                        return (
                            <Touchable onPress={checkIconPass}>
                                {iconPass ? <IcHidePass width={20} height={20} /> : <IcShowPass width={20} height={20} />}
                            </Touchable>
                        );
                    }
                    return <IcPass width={20} height={20} />;
                case arrayIcon.login.name:
                    return <IcName width={20} height={20} />;
                case arrayIcon.login.search:
                    return <IcSearch />;
                case arrayIcon.login.channel:
                    return <ICUnderArrow />;
                default:
                    return null;
            }
        }, [rightIcon, value, checkIconPass, iconPass]);

        return (
            <>
                <Animated.View
                    style={containerStyle}
                    ref={ref}
                >
                    <View style={styles.flexRow}>
                        {leftIcon}
                        <TextInput
                            ref={orgTextInput}
                            {...defInputProps}
                            style={[styles.inputStyle, _inputStyle]}
                            placeholder={placeHolder}
                            placeholderTextColor={placeHolderColor || COLORS.GRAY_4}
                            selectionColor={COLORS.GRAY_4}
                            numberOfLines={1}
                            secureTextEntry={isPassword ? iconPass : false}
                            autoCorrect={false}
                            autoCapitalize={autoCapitalized || 'none'}
                            value={`${textfieldVal}`}
                            maxLength={maxLength}
                            multiline={multiline}
                            returnKeyType={multiline ? 'next' : 'done'}
                            onChangeText={eventTextChange}
                            onKeyPress={onKeyPress}
                            onEndEditing={eventEndEditing}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            editable={!disabled}
                            testID={testID}
                            autoFocus={autoFocus}
                            defaultValue={defaultValue}
                        />
                        {checkIconRight}
                    </View>
                </Animated.View>
                {errorMessage}
            </>
        );
    }
);
