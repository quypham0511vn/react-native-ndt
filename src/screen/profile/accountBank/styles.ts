import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';


export const MyStylesAccountBank = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapAllContent: {
        paddingHorizontal: 16,
        paddingTop: 10
    },
    txtBankChoose: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size14
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
    groupInput: {
        marginBottom: 20
    },
    pwd: {
        top: 0
    },
    rowContainerAllInputChoose: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12
    },
    rowContainerItemInputChoose: {
        flexDirection: 'row',
        marginRight: 20
    },
    textChooseToInput: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingLeft: 10
    },
    containerItemFilter: {
        marginBottom: 10
    },
    rowItemFilter: {
        backgroundColor: COLORS.WHITE,
        width: '100%',
        borderColor: COLORS.GRAY_11,
        borderRadius: 20,
        marginVertical: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    valuePicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_1
    },
    placeHolderPicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_16
    },
    wrapBtnAddAcc:{
        marginTop: 24
    }
}), []);
