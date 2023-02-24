import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';


export const myTextFieldStyle = () => useMemo(
    () =>
        StyleSheet.create({
            container: {
                justifyContent: 'center',
                paddingHorizontal: 5,
                borderRadius: 5,
                paddingVertical: 0,
                height: Configs.FontSize.size40,
                borderColor: COLORS.LIGHT_GRAY,
                borderWidth: 1
            },
            containerMultiline: {
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: 10,
                height: undefined
            },
            labelStyle: {
                color: COLORS.DARK_GRAY,
                fontSize: Configs.FontSize.size14,
                fontFamily: Configs.FontFamily.regular
            },
            inputStyle: {
                flex: 1,
                color:COLORS.BLACK,
                width: '100%',
                height: '100%',
                borderRadius: 20
            },
            inputFont: {
                ...Styles.typography.regular,
                color: COLORS.DARK_GRAY,
                fontSize: Configs.FontSize.size13
            },
            showHidePassContainer: {
                position: 'absolute',
                right: 5,
                alignSelf: 'center',
                padding: 5
            },
            errorMessage: {
                fontSize: Configs.FontSize.size12,
                fontFamily: Configs.FontFamily.medium,
                color: COLORS.RED,
                marginHorizontal: 10,
                paddingTop: 10
            },
            flexRow: {
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems:'center'
            },
            leftIconContainer: {
                width: 20,
                height: '100%',
                marginLeft: 10,
                justifyContent: 'center'
            },
            icRightOther: {
                width: Configs.IconSize.size16,
                height: Configs.IconSize.size16
            },
            leftIcon: {
                ...Styles.typography.regular,
                fontSize: Configs.IconSize.size14,
                color: COLORS.GRAY,
                marginRight: 10
            },
            rightIcon: {
                ...Styles.typography.regular,
                fontSize: Configs.IconSize.size14,
                color: COLORS.GRAY,
                marginLeft: 10
            },
            icPwd: {
                position: 'relative',
                right: 0,
                top: 0,
                zIndex: 9999
            }
        })
    , []);
