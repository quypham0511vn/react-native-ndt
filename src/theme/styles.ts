import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { COLORS } from './colors';


export const Styles = {
    flexColumn: {
        flex: 1
    },

    typography: StyleSheet.create({
        // white
        regular: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.regular
        },
        medium: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.medium
        },
        mediumSmall: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size10,
            fontFamily: Configs.FontFamily.medium
        },
        bold: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.bold
        }
    }),
    shadow: {
        backgroundColor: COLORS.WHITE,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 1
    },
    heavyShadow: {
        backgroundColor: COLORS.WHITE,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 2,
        shadowRadius: 14,
        elevation: 10
    },
    textTransform: {
        textTransform: 'uppercase'
    }
};

export const HtmlStyles = {
    a: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center'
    },
    b: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center'
    },
    c: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size14,
        textAlign: 'center'
    },
    w: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center'
    },
    g: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size14
    },
    r: {
        ...Styles.typography.medium,
        color: COLORS.RED_3,
        fontSize: Configs.FontSize.size14,
        marginTop: 15
    },
    rn: {
        ...Styles.typography.medium,
        color: COLORS.RED_3,
        fontSize: Configs.FontSize.size14
    },
    s: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size14
    },
    t: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        textAlign: 'center',
        color: COLORS.GRAY_7
    },
    m: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY
    },
    p: {
        marginVertical: 5
    },
    i: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_7
    },
    e: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.GRAY_7
    },
    g1: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size12
    },
    vimo: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size14,
        color: COLORS.GRAY_7,
        textAlign: 'left'
    },
    cm: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size13,
    },
    bn: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size13,
    },
    notify: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size13,
        marginVertical: 5
    },
};

export const HtmlStylesSeen = {
    w: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_2,
        fontSize: Configs.FontSize.size14,
        marginTop: 5
    },
    b: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_2,
        fontSize: Configs.FontSize.size14,
        marginTop: 5
    },
    span: {
        ...Styles.typography.medium,
        color: COLORS.BLUE,
        fontSize: Configs.FontSize.size14,
        marginTop: 5
    },
    a: {
        ...Styles.typography.medium,
        color: COLORS.BLUE,
        fontSize: Configs.FontSize.size14,
        marginTop: 5
    }
};

export const RenderHtmlStyle = {
    p: {
        paddingTop: 0,
        paddingBottom: 0,
    },
};
