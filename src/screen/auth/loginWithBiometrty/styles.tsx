import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs, PADDING_TOP } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';


export const MyStylesLogin = () => useMemo(() => StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS.GREEN,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    inputPhone: {
        marginTop: 15,
        borderRadius: 30,
        height: Configs.FontSize.size40,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputPass: {
        marginTop: 15,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        height: Configs.FontSize.size40
    },
    rowInfo: {
        marginTop: 15,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    wrapAll: {
        flex: 1,
        paddingBottom: PADDING_TOP,
        marginTop: SCREEN_HEIGHT / 3,
        height: SCREEN_HEIGHT / 3,
        width: '80%',
        position: 'absolute',
        top: -20
    },
    checkbox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom:5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16
    },
    content: {
        justifyContent: 'center',
        marginHorizontal: 10,
        position:'absolute',
        top:-80
        // backgroundColor: COLORS.RED
    },
    txtSave: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size14,
        marginLeft: 3
    },
    txtSubmit: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GRAY_7,
        padding: 5
    },
    tobLogin: {
        width: SCREEN_WIDTH * 0.4,
        height: Configs.FontSize.size40,
        backgroundColor: COLORS.GREEN,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    checkContainer: {
        paddingTop: 20
    },
    wrapLoginTxt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SCREEN_HEIGHT * 0.1
    },
    wrapAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.GREEN
    },
    wrapBt: {
        flexDirection: 'row',
        marginTop: 10
    },
    wrapPin: {
        flex: 1
    },
    circleWrap: {
        width: SCREEN_WIDTH * 0.2 - 10,
        height: SCREEN_WIDTH * 0.2 - 10,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.GREEN
    }
}), []);
