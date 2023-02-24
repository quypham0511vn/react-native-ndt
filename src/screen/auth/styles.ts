import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';

export const myStylesAuth = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 1,
        backgroundColor: COLORS.GREEN,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 1.5
    },
    tob: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.18,
        right: SCREEN_WIDTH * 0.18,
        width: SCREEN_WIDTH * 0.3,
        height: SCREEN_HEIGHT * 0.1,
        transform: [
            { rotateX: '-30deg' },
            { rotateY: '0deg' },
            { rotateZ: '40deg' }
        ]
    },
    tob1: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.5,
        width: 150,
        height: 30,
        right: -50,
        transform: [
            { rotateX: '-30deg' },
            { rotateY: '-20deg' },
            { rotateZ: '90deg' }
        ]
    },
    tob2: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.16,
        right: SCREEN_WIDTH * 0.2,
        width: 200,
        height: 30,
        transform: [
            { rotateX: '-30deg' },
            { rotateY: '0deg' },
            { rotateZ: '140deg' }
        ]
    },
    txt: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size20,
        borderRadius: 20
    },
    wrapContent: {
        paddingHorizontal: 16,
        flex: 1
    },
    wrapLogo: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain'
    },
    inputPhone: {
        borderRadius: 30,
        height: Configs.FontSize.size50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputPass: {
        marginTop: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '80%',
        height: Configs.FontSize.size50
    },
    rowInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginHorizontal: 4
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    wrapAll: {
        flex: 1,
        top: SCREEN_HEIGHT / 2 - SCREEN_HEIGHT * 0.22,
        position: 'absolute',
        height: SCREEN_HEIGHT * 0.4,
        borderTopEndRadius: 60,
        borderBottomEndRadius: 60
    },
    viewLogo: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        top: 0
    },
    iconClose: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.055,
        right: 0,
        width: 40,
        height: 40,
        zIndex: 1
    },
    checkbox: {
        justifyContent: 'flex-end',
        marginTop: 10,
        width: 30,
        height: 30,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20
    },
    inputStyle: {},
    height100: {
        height: 100
    },
    circle: {
        ...Styles.shadow,
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    bottom: {
        justifyContent: 'flex-start',
        flex: 1
    },
    content: {
        justifyContent: 'center',
        marginHorizontal: 10,
        height: SCREEN_HEIGHT * 0.3
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    button: {
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 15
    },
    txtSave: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size12,
        marginLeft: 5
    },
    txtSubmit: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size12
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size24,
        color: COLORS.BLACK,
        padding: 20
    },
    viewSvg: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH
    },
    tobLogin: {
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.12,
        backgroundColor: COLORS.GREEN,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewBottom: {
        flex: 1,
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        paddingHorizontal: 16,
        bottom: SCREEN_HEIGHT * 0.05,
        justifyContent: 'space-between'
    },
    txtLogin: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE
    },
    viewIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        padding: 5
    },
    func: {
        height: SCREEN_HEIGHT * 0.5,
        position: 'absolute',
        top: -SCREEN_HEIGHT * 0.066,
        width: SCREEN_WIDTH * 0.7
    }
}), []);
