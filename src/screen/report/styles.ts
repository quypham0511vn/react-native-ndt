import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';

export const MyStylesReport = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    containerContent: {
        justifyContent: 'space-between'
    },
    chartContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderColor: COLORS.GRAY_13,
        borderWidth: 1,
        paddingTop: 8
    },
    chartTitle: {
        ...Styles.typography.medium,
        borderColor: COLORS.GRAY_7,
        marginLeft: 16
    },
    overviewQuarterTitle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size16,
        marginTop: 20,
        paddingBottom: 8
    },
    chartInvest: {
        data: {
            fill: COLORS.DARK_YELLOW
        },
        backgroundColor: COLORS.YELLOW_2
    },
    chartEarning: {
        data: {
            fill: COLORS.GREEN
        },
        backgroundColor: COLORS.GREEN
    },
    rectangleInvest: {
        width: 16,
        height: 16,
        backgroundColor: COLORS.DARK_YELLOW
    },
    rectangleEarning: {
        width: 16,
        height: 16,
        backgroundColor: COLORS.GREEN
    },
    row: {
        flexDirection: 'row',
        marginLeft: 25,
        paddingBottom: 5
    },
    noteChart: {
        marginLeft: 10
    },
    txtContractNumber: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size16,
        paddingVertical: 8
    },
    txtInvestNumber: {
        ...Styles.typography.regular,
        color: COLORS.RED_2,
        fontSize: Configs.FontSize.size16,
        paddingVertical: 8
    },
    txtEarning: {
        color: COLORS.GRAY_7,
        paddingVertical: 8
    },
    txtInterest: {
        color: COLORS.GREEN_2,
        paddingVertical: 4
    },
    overviewQuarterTxt: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        marginVertical: 8,
        fontSize: Configs.FontSize.size20,
        textAlign: 'center'
    },
    monthTxt: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        marginVertical: 8,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center'
    },
    containerItem: {
        marginBottom: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderColor: COLORS.GRAY_13,
        borderWidth: 1
    },
    containerItemOverview: {
        marginTop: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderColor: COLORS.GRAY_13,
        borderWidth: 1
    },
    flatList: {
        marginHorizontal: 16
    },
    labelAxis: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size12
    },
    labelAxisSmall: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        fontSize: Configs.FontSize.size10
    },
    rowFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16
    },
    rowItemFilter: {
        backgroundColor: COLORS.WHITE,
        width: SCREEN_WIDTH / 2 - 30,
        borderColor: COLORS.GRAY_11,
        borderRadius: 20,
        marginVertical: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1
    },
    txtQuarter: {
        ...Styles.typography.medium,
        textAlign: 'center',
        color: COLORS.GREEN,
        paddingLeft: 35
    },
    txtArrow: {
        marginVertical: 8
    },
    containerItemFilter: {
        marginBottom: -45
    },
    containerContentKeyValue: {
        width: '100%',
        alignItems: 'center'
    },
    textLeftMonth: {
        paddingVertical: 8
    }
}), []);
