import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS } from '@/theme';
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH_ANDROID, SCREEN_HEIGHT_ANDROID } from '@/utils/DimensionUtils';

export const MyStylesSignSuccess = () => useMemo(() => StyleSheet.create({
    main: {
        marginTop: SCREEN_HEIGHT / 1.8,
        position: 'absolute',
        width: '80%',
        marginHorizontal: 10
    },
    txtSuccess: {
        color: COLORS.WHITE,
        marginVertical: 15,
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.regular
    },
    txtNotifySuccess: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.WHITE
    },
    txtContinue: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        fontFamily: Configs.FontFamily.bold
    },
    viewIOS: {
        width: '100%',
        borderColor: COLORS.WHITE,
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.06,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewANDROID: {
        width: '100%',
        borderColor: COLORS.WHITE,
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.12,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    tobContinue: {
        width: '40%',
        height: 40,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 20
    },
    imageANDROID: {
        width: SCREEN_WIDTH_ANDROID,
        height: SCREEN_HEIGHT_ANDROID
    },
    imageIOS: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    logo: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.05,
        left: SCREEN_WIDTH * 0.08
    },
    logoText: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.15,
        left: SCREEN_WIDTH * 0.08
    },
    logoPersion: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.23,
        left: SCREEN_WIDTH * 0.02
    }
}), []);
