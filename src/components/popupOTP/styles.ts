import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';

export const MyStylesOtpInvest = () => useMemo(() =>
    StyleSheet.create({
        main: {
            flex: 1,
            backgroundColor: COLORS.WHITE_GRAY,
            alignItems: 'center'
        },
        container: {
            flex: 1,
            backgroundColor: COLORS.TRANSPARENT,
            borderColor: COLORS.TRANSPARENT,
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            ...Styles.typography.bold,
            fontSize: Configs.FontSize.size16
        },
        txt: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size14,
            color: COLORS.BLACK,
            padding: 25,
            textAlign: 'center'
        },
        inputOtp: {
            ...Styles.typography.mediumSmall,
            color: COLORS.BLACK,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        },
        viewOtp: {
            width: SCREEN_WIDTH * 0.12,
            height: SCREEN_WIDTH * 0.12,
            marginVertical: 10,
            marginHorizontal: 2,
            borderWidth: 1,
            borderRadius: SCREEN_WIDTH * 0.07,
            justifyContent: 'center',
            alignItems: 'center'
        },
        boxOtp: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SCREEN_WIDTH * 0.01,
            marginBottom: SCREEN_WIDTH * 0.01,
            marginLeft: 8
        },
        tobModal: {
            flexDirection: 'column',
            height: SCREEN_HEIGHT / 2.5,
            backgroundColor: COLORS.WHITE,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }), [])
    ;
