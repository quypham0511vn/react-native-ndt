import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';


type ItemProps = {
    label: string;
    value: string
    colorText?: string

};
const ItemInfoContract = ({ label, value, colorText }: ItemProps
) => {
    const styleText = {
        color: colorText || COLORS.GRAY_7
    } as TextStyle;

    return (
        <>
            <Dash
                dashThickness={1}
                dashLength={10}
                dashGap={5}
                dashColor={COLORS.GRAY_13} />
            <View style={styles.wrapItem}>
                <Text numberOfLines={3} style={styles.label}>{label}</Text>
                <Text style={[styles.txtValue, styleText]} numberOfLines={2}>{value}</Text>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        alignItems: 'center'
    },
    label: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size12
    },
    txtValue: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        maxWidth: '70%',
        fontSize: Configs.FontSize.size13
    }
});
export default ItemInfoContract;


