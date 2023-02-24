import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { Configs } from '@/common/Configs';
import { Styles } from '@/theme';
import { COLORS } from '@/theme/colors';

export const MyStylesInvest = () => useMemo(() =>
    StyleSheet.create({
        wrapContent: {
            marginHorizontal: 16
        },
        scroll: {
            paddingBottom: 200
        },
        title: {
            ...Styles.typography.regular,
            textAlign: 'center',
            fontSize: Configs.FontSize.size20,
            color: COLORS.GRAY_7,
            marginBottom: 10
        },
        wrapInfo: {
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.GRAY_11,
            paddingTop: 16,
            paddingBottom: 4,
            marginBottom: 30
        },
        wrapIcon: {
            alignSelf: 'center',
            paddingVertical: 16
        },
        wrapItemInfo: {
            alignItems: 'flex-end'
        },
        txtDate: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size10,
            color: COLORS.GRAY_12
        },
        txtDue: {
            ...Styles.typography.regular
        },
        button: {
            width: '100%',
            backgroundColor: COLORS.GREEN,
            paddingVertical: 10,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center'
        },
        txtBt: {
            ...Styles.typography.medium,
            color: COLORS.WHITE
        },
        money: {
            ...Styles.typography.medium,
            color: COLORS.GREEN,
            fontSize: Configs.FontSize.size24,
            textAlign: 'center'
        },
        labelMoney: {
            ...Styles.typography.regular,
            textAlign: 'center',
            fontSize: Configs.FontSize.size14,
            color: COLORS.GRAY_7
        },
        wrapItemMethod: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            backgroundColor: COLORS.WHITE,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.GRAY_11,
            marginTop: 8,
            alignItems: 'center',
            height: 60
        },
        wrapLabel: {
            marginLeft: 14,
            justifyContent: 'center',
            flex: 1
        },
        greenText: {
            ...Styles.typography.regular,
            color: COLORS.GREEN
        },
        txtMethod: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_7
        },
        btSelected: {
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: COLORS.GRAY_7,
            justifyContent: 'center',
            alignItems: 'center'
        },
        circle: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: COLORS.GREEN
        },
        headerText: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            marginTop: 24
        },
        viewBottom: {
            marginVertical: 25,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 5
        },
        tobBottom: {
            marginVertical: 10,
            height: 50,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: COLORS.GREEN,
            borderRadius: 20,
            alignItems: 'center',
            marginBottom: 10
        },
        txtTob: {
            ...Styles.typography.regular,
            color: COLORS.WHITE,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.regular
        },
        txtCheckBox: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size14,
            color: COLORS.BLACK
        },
        policy: {
            width: '90%',
            height: '100%',
            marginLeft: 10
        }
    }), []);
