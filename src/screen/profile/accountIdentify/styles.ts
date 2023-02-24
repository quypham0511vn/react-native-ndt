import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';

export const MyStylesAccountIdentify = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapAll: {
        paddingHorizontal: 16,
        width: '100%'
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        marginVertical: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_13
    },
    pickerContainer: {
        marginBottom: -40
    },
    wrapInput: {
        paddingTop: 10
    },
    accuracyWrap: {
        width: '100%',
        borderRadius: 70,
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 8,
        marginBottom: 30
    },
    inputStyle: {
        borderWidth: 1,
        borderRadius: 30,
        marginVertical: 5
    },
    labelStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    titlePhoto: {
        ...Styles.typography.medium,
        color: COLORS.RED_2,
        paddingTop: 16
    },
    txtNotePhoto: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size12,
        paddingVertical: 4
    }
}), []);
