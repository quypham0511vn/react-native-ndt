import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH_ANDROID, SCREEN_HEIGHT_ANDROID } from '@/utils/DimensionUtils';
import { COLORS } from '@/theme';
import { Configs } from '@/common/Configs';

export const MyStylesCard = () => useMemo(() =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            zIndex: -1
        },
        imageANDROID: {
            width: SCREEN_WIDTH_ANDROID,
            height: SCREEN_HEIGHT_ANDROID
        },
        imageIOS: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT
        },
        gradient: {
            color: COLORS.TRANSPARENT,
            position: 'absolute',
            width: '100%'
        },
        title: {
            fontSize: Configs.FontSize.size20,
            color: COLORS.WHITE,
            fontFamily: Configs.FontFamily.regular,
            marginVertical: 10
        },
        txtContinue: {
            fontSize: Configs.FontSize.size16,
            color: COLORS.WHITE,
            fontFamily: Configs.FontFamily.regular,
            paddingVertical: '3%',
            textAlign: 'center'
        },
        txt: {
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.regular,
            color: COLORS.WHITE,
            lineHeight: 24
        },
        viewBottom: {
            marginTop: SCREEN_HEIGHT / 1.8,
            position: 'absolute',
            width: '80%',
            marginHorizontal: 10
        },
        viewText: {
            width: '100%'
        },
        tobIOS: {
            width: '40%',
            borderRadius: 25,
            borderWidth: 1,
            borderColor: COLORS.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: SCREEN_WIDTH * 0.25
        },
        tobANDROID: {
            width: '40%',
            borderRadius: 25,
            borderWidth: 1,
            borderColor: COLORS.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: SCREEN_WIDTH * 0.25
        },
        viewIOS: {
            width: '100%',
            borderColor: COLORS.WHITE,
            position: 'absolute',
            bottom: SCREEN_HEIGHT * 0.06,
            left: 10,
            alignItems: 'center',
            flexDirection: 'row'
        },
        viewANDROID: {
            width: '100%',
            borderColor: COLORS.WHITE,
            position: 'absolute',
            bottom: SCREEN_HEIGHT * 0.12,
            left: 10,
            alignItems: 'center',
            flexDirection: 'row'
        },
        logo: {
            position: 'absolute',
            top: SCREEN_HEIGHT * 0.05,
            left: SCREEN_WIDTH * 0.08
        }
    }), []);
