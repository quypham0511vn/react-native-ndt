import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';

export const MyStylesChangePass = () => useMemo(() => StyleSheet.create({
    inputPass: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        marginVertical: 5,
        height: Configs.FontSize.size40
    },
    rowInfo: {
        marginTop: SCREEN_HEIGHT * 0.02,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    checkbox: {
        justifyContent: 'space-between',
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16
    },
    content: {
        flex: 1,
        marginTop: SCREEN_HEIGHT * 0.06,
        marginLeft: 10,
        width: '90%'
    },
    txtSave: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size12,
        marginLeft: SCREEN_WIDTH * 0.01
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
        alignItems: 'center'
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
    txt: {
        color: COLORS.GRAY, 
        fontSize: Configs.FontSize.size12, 
        fontFamily: Configs.FontFamily.regular
    },
    viewTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewTxt: {
        marginVertical: 10
    }
        
}), []);
