import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';

export const MyStylesLinkWallet = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapAllContent: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 30,
        paddingBottom: 16,
        alignSelf: 'center'
    },
    wrapBtnLinkWallet: {
        ...Styles.shadow,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.GRAY_2,
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 20
    },
    wrapBtnLinkWalletChooser: {
        ...Styles.shadow,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: COLORS.WHITE
    },
    redText: {
        color: COLORS.RED
    },
    stateItemLink: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        paddingTop: 10
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
    },
    txtOnPressToLink:{
        ...Styles.typography.regular,
        color: COLORS.GRAY_1,
        paddingTop: 8
    }
}), []);
