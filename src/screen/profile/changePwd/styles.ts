import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';


export const MyStylesChangePwd = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    group: {
        paddingTop: 20,
        paddingRight: 15,
        paddingLeft: 15
    },
    groupInput: {
        marginBottom: 20
    },
    title: {
        ...Styles.typography.regular,
        marginBottom: 5
    },
    containerStyle: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 30,
        alignItems: 'center'
    },
    containerDisableStyle: {
        backgroundColor: COLORS.TRANSPARENT,
        borderRadius: 30,
        alignItems: 'center'
    },
    inputStyle: {
        ...Styles.typography.regular,
        paddingVertical: 20,
        fontSize: Configs.FontSize.size14
    },
    button: {
        paddingHorizontal: 15
    },
    pwd: {
        top: 0
    },
    btnStyle: {
        borderRadius: 30
    }
}), []);
