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
        height: SCREEN_HEIGHT,
        justifyContent: 'center'
    },
    inputPhone: {
        marginTop: 15,
        borderRadius: 30,
        height: Configs.FontSize.size40,
        width: '100%',
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
        width: '100%',
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
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    checkboxBtn: {
        borderRadius: 10
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
        marginVertical: SCREEN_HEIGHT * 0.06
    },
    txtSave: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        marginLeft: 10,
        fontSize: Configs.FontSize.size16
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
        marginTop: 10,
        width: SCREEN_WIDTH * 0.4,
        height: Configs.FontSize.size40,
        backgroundColor: COLORS.GREEN,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkContainer: {
        paddingTop: 20
    },
    wrapLoginTxt: {
        flexDirection: 'row',
        alignItems: 'center'
    }
}), []);
