import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';

export const MyStylesShareFriend = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapAllContent: {
        paddingHorizontal: 16,
        paddingTop: 5,
        paddingBottom: 16,
        alignSelf: 'center'
    },
    txtMyQrCode: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size16,
        marginTop: 24,
        paddingBottom: 8
    },
    textCode: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        paddingVertical: 6,
        paddingLeft: 16
    },
    wrapQR: {
        alignItems: 'center'
    },
    txtQR: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size16,
        paddingVertical: 16
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_13,
        borderWidth: 1,
        borderColor: COLORS.GRAY_14,
        marginRight: 10,
        borderRadius: 40
    },
    wrapBtnShare:{
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        borderRadius: 40,
        margin: 2
    }
}), []);
