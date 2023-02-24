import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';

const KeyValueReport = (
    { title, content, noIndicator, styleColor,
        styleContainer, leftIcon, rightIcon, hasDashBottom,
        styleTouchable, styleTitle, containerContent, defaultValue, numberOfLine }:
        {
            noIndicator?: boolean,
            title: string,
            content?: string,
            styleColor?: TextStyle,
            styleContainer?: ViewStyle,
            leftIcon?: any,
            rightIcon?: any,
            styleTouchable?: any,
            hasDashBottom?: boolean,
            onPress?: any,
            styleTitle?: TextStyle,
            containerContent?: ViewStyle,
            defaultValue?: string | number | undefined,
            numberOfLine?: number
        }
) => (
    <View style={[styles.container, styleContainer]}>
        {!noIndicator && <Dash
            dashThickness={1}
            dashLength={10}
            dashGap={5}
            dashColor={COLORS.GRAY_13} />
        }

        <View style={[styles.row, styleTouchable]}>
            {leftIcon || null}
            <View style={[styles.rowCenter, containerContent]}>
                <Text style={[styles.leftText, styleTitle]}>{title}</Text>
                <Text numberOfLines={numberOfLine || 1} style={[styles.contentText, styleColor]}>{content || defaultValue}</Text>
            </View>
            {rightIcon || null}
        </View>
        {hasDashBottom && <Dash
            dashThickness={1}
            dashLength={10}
            dashGap={5}
            dashColor={COLORS.GRAY_13}
        />
        }
    </View>
);

export default KeyValueReport;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        borderRadius: 16,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        paddingVertical: 4
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        alignSelf: 'flex-start'
    },
    contentText: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        alignSelf: 'flex-end'
    }

});
