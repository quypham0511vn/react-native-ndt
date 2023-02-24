import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';

export const useStyleButton = () => useMemo(
    () =>
        StyleSheet.create({
            // default
            container: {
                alignItems: 'center',
                paddingHorizontal: 15,
                justifyContent: 'center',
                height: Configs.FontSize.size45,
                borderRadius: 25,
                flexDirection: 'row'
            },
            icon: {
                width: Configs.IconSize.size14,
                height: Configs.IconSize.size14,
                marginRight: 5
            },
            rightIcon: { 
                paddingLeft: 10
            },
            lefIconFont: { 
                ...Styles.typography.regular,
                paddingRight: 20,
                fontSize: Configs.IconSize.size30
            },
            text: {
                ...Styles.typography.medium,
                textAlign: 'center',
                flex: 1,
                color: COLORS.WHITE
            },
            // background & border
            greenButton: {
                backgroundColor: COLORS.GREEN
            },
            greenButton_1: {
                backgroundColor: COLORS.GREEN_1
            },
            blueButton: {
                backgroundColor: COLORS.BLUE
            },
            grayButton: {
                backgroundColor: COLORS.GRAY_2
            },
            darkBlueBtn: {
                backgroundColor: COLORS.BLUE_1
            },
            grayRedBtn:{
                backgroundColor: COLORS.GRAY_13
            },
            lightGreen:{
                backgroundColor: COLORS.LIGHT_GREEN
            }
        }),
    []
);
