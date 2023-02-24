import { StyleSheet } from 'react-native';
import {useMemo} from 'react';

import { COLORS , Styles} from '@/theme';
import { Configs } from '@/common/Configs';

export const MyStylePupUpStatus = () => useMemo(() =>
    StyleSheet.create({
        popup: {
            backgroundColor: COLORS.WHITE,
            borderColor: COLORS.TRANSPARENT,
            borderRadius: 6,
            borderWidth: 1,
            paddingBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        ic: {
            marginTop: 10,
            marginBottom: -10,
            width: Configs.IconSize.size39,
            height: Configs.IconSize.size39
        },
        txtTitle: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            color: COLORS.BLACK,
            textAlign: 'center',
            marginTop: 20
        },
        txtContent: {
            ...Styles.typography.regular,
            marginVertical: 10,
            marginHorizontal: 10,
            textAlign: 'center'
        },
        btn: {
            width: '50%',
            marginTop: 10
        }
    })
, []);
