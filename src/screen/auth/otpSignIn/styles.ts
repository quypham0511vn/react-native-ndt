import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';

export const MyStylesOtp = () => useMemo(() =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginTop: SCREEN_HEIGHT * 0.06,
            marginHorizontal: 15
        },
        viewTop: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        containerBox: {
            paddingVertical: 16
        },
        confirmOtp: {
            ...Styles.typography.medium,
            marginTop: 10,
            color: COLORS.GRAY
        
        },
        boxOtp: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SCREEN_WIDTH * 0.02,
            marginBottom: SCREEN_WIDTH * 0.01,
            marginLeft: SCREEN_WIDTH * 0.01
        },
        inputOtp: {
            ...Styles.typography.mediumSmall,
            color: COLORS.BLACK,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        },
        notifyOtp: {
            marginTop: Configs.FontSize.size30
        },
        text: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_9,
            marginBottom: 20
        },
        txtTitle: {
            ...Styles.typography.bold,
            fontSize: Configs.FontSize.size20,
            color: COLORS.BLACK
        },
        tobConfirm: {
            marginTop: 10,
            width: SCREEN_WIDTH * 0.4,
            height: Configs.FontSize.size40,
            backgroundColor: COLORS.GREEN,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center'
        },
        txtConfirm: {
            ...Styles.typography.regular,
            color: COLORS.WHITE
        },
        disTxtConfirm: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_12
        },
        sentOtp: {
            width: SCREEN_WIDTH * 0.5,
            height: SCREEN_HEIGHT * 0.05,
            marginVertical: 20,
            marginHorizontal: 5
        },
        txtOtp: {
            ...Styles.typography.regular,
            color: COLORS.RED
        },
        wrapOTP: {
            backgroundColor: COLORS.TRANSPARENT,
            height: SCREEN_WIDTH * 0.14,
            paddingHorizontal: 10,
            paddingLeft: 20,
            flexDirection: 'row',
            marginBottom: 10
        },
        viewOtp: {
            ...Styles.typography.medium,
            width: SCREEN_WIDTH * 0.11,
            height: SCREEN_WIDTH * 0.11,
            marginVertical: 10,
            marginHorizontal: 2,
            borderWidth: 1,
            borderRadius: ((SCREEN_WIDTH - 64 - 5 * 5) / 6) / 2,
            borderColor: COLORS.GRAY_6,
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size18,
            textAlign: 'center'
        }
    }), []);
