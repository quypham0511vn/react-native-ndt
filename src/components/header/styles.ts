import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { COLORS, Styles } from '@/theme';
import { Configs, PADDING_TOP, STATUSBAR_HEIGHT } from '@/common/Configs';

const IMG_HEADER_HEIGHT = SCREEN_WIDTH / 375 * 85;
export const MyStylesHeader = () => useMemo(() => StyleSheet.create({
    container: {
        height: IMG_HEADER_HEIGHT
    },
    imageBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 2.9
    },
    imageBg1: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: IMG_HEADER_HEIGHT,
        tintColor: COLORS.WHITE
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP,
        marginHorizontal: SCREEN_HEIGHT * 0.01
    },
    goBack: {
        justifyContent: 'center'
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: 30
    },
    titleCenter: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        textAlign: 'center',
        color: COLORS.WHITE
    },
    titleCenter1: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        textAlign: 'center',
        color: COLORS.GREEN
    },
    imgBack: {
        width: SCREEN_WIDTH * 0.05,
        height: SCREEN_WIDTH * 0.05
    },
    logo: {
        marginLeft: SCREEN_WIDTH * 0.05
    },
    imgNotify: {
        width: SCREEN_WIDTH * 0.08,
        height: SCREEN_WIDTH * 0.08
    },
    viewRight: {
        position: 'absolute',
        right: 10
    }
}), []);
