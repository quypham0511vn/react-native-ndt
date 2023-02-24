import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';

export const MyStylesAccountLink = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_15
    },
    wrapAllContent: {
        paddingHorizontal: 16,
        paddingTop: 10
    },
    wrapItemSocial: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.GRAY_2,
        borderRadius: 18,
        paddingHorizontal: 16,
        marginTop: 16,
        backgroundColor: COLORS.WHITE
    },
    wrapRightItemSocial: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '85%'
    },
    titleItemLink: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    stateItemLink: {
        ...Styles.typography.regular,
        color: COLORS.GREEN
    },
    wrapRightIcon: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: COLORS.GRAY_12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    redText:{
        color:COLORS.RED
    },
    greenBorder:{
        borderColor:COLORS.GREEN
    }
}), []);
