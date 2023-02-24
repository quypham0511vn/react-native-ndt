import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';

export const MyStylesPaymentMethod = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapAllContent: {
        paddingHorizontal: 16,
        paddingTop: 10
    },
    txtMethodChoose: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size16
    },
    txtMethodName: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    wrapItemPayment: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.GRAY_2,
        borderRadius: 18,
        paddingRight: 16,
        paddingLeft: 10,
        marginTop: 8,
        backgroundColor: COLORS.WHITE
    },
    wrapItemPaymentChooser: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        borderRadius: 18,
        paddingRight: 16,
        paddingLeft: 10,
        marginTop: 8,
        backgroundColor: COLORS.WHITE
    },
    wrapRightItemPayment: {
        justifyContent: 'space-between',
        flex:1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 13
    },
    titleItemLink: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    stateItemLink: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        paddingTop: 4
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
    redText: {
        color: COLORS.RED
    },
    greenBorder: {
        borderColor: COLORS.GREEN
    },
    containerAllBtnPopup:{
        flexDirection: 'row-reverse'
    },
    containerItemBtnPopup:{
        backgroundColor: COLORS.RED_2,
        borderColor : COLORS.RED_2,
        borderRadius: 20
    },
    containerCancelBtnPopup:{
        borderColor : COLORS.GRAY_13,
        borderRadius: 20
    },
    textCancel:{
        color: COLORS.GRAY_12
    }
}), []);
