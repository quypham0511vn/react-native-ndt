import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Touchable } from './elements/touchable';


const KeyValue = (
    { title,
        styleContainer,
        leftIcon,
        rightIcon,
        hasDashBottom,
        styleTouchable,
        onPress,
        styleTitle,
        containerContent,
        disable }:
        {
            title: string,
            styleContainer?: ViewStyle,
            leftIcon?: any,
            rightIcon?: any,
            styleTouchable?: any,
            hasDashBottom?: boolean,
            onPress?: any,
            styleTitle?: TextStyle,
            containerContent?: ViewStyle,
            disable?: boolean
        }
) => (
    <View style={[styles.container, styleContainer]}>
        <Touchable style={[styles.row, styleTouchable]} onPress={onPress} disabled={disable}>
            {leftIcon || null}
            <View style={[styles.rowCenter, containerContent]}>
                <Text style={[styles.leftText, styleTitle]}>{title}</Text>
                {rightIcon || null}
            </View>
        </Touchable>
        {hasDashBottom && <Dash
            dashThickness={1}
            dashLength={10}
            dashGap={4}
            dashColor={COLORS.GRAY_13}
            style={styles.dash}
        />
        }
    </View>
);

export default KeyValue;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        borderRadius: 16,
        flex: 1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12
    },
    rowCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14
    },
    leftText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    dash: {
        paddingVertical: 1
    }
});
