import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';

export const MyStylesProfile = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    contentContainer: {
        marginHorizontal: 16
    },
    containerPayMethodFeature: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_13,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        paddingVertical: 2
    },
    containerFeature: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_13,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginTop: 16,
        paddingVertical: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.GRAY_13,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginVertical: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        alignItems: 'center'
    },
    accContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.GRAY_13,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginVertical: 16
    },
    leftText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    contentText: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    dash: {
        paddingBottom: 10
    },
    stylePayMethodContainer: {
        paddingVertical: 10,
        marginTop: 16
    },
    headerAccRight: {
        paddingVertical: 16
    },
    notAccuracyWrap: {
        backgroundColor: COLORS.PINK,
        borderRadius: 70,
        alignItems: 'center',
        paddingVertical: 5,
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.5
    },
    waitAccuracyWrap: {
        backgroundColor: COLORS.YELLOW_3,
        borderRadius: 70,
        alignItems: 'center',
        paddingVertical: 5,
        width: SCREEN_WIDTH * 0.5
    },
    accuracyWrap: {
        backgroundColor: COLORS.WHITE_GREEN,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        width: SCREEN_WIDTH * 0.5
    },
    circleWrap: {
        width: SCREEN_WIDTH * 0.2 - 10,
        height: SCREEN_WIDTH * 0.2 - 10,
        borderRadius: 100000,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.GREEN
    },
    version: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_9,
        textAlign: 'right',
        fontSize: Configs.FontSize.size10,
        marginTop: 10,
        marginBottom: 5 
    },
    headerAccName: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size16
    },
    headerAccPhone: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize: Configs.FontSize.size12,
        paddingVertical: 4
    },
    txtNotAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.RED_2,
        fontSize: Configs.FontSize.size12
    },
    txtWaitAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.YELLOW_2,
        fontSize: Configs.FontSize.size12,
        textAlign: 'center'
    },
    txtAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size12,
        textAlign: 'center'
    },
    wrapBtn: {
        marginVertical: 10,
        width: SCREEN_WIDTH - 32,
        height: SCREEN_HEIGHT * 0.06
    },
    txtAuthnFinger: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingVertical: 7
    },
    txtTitleKeyValue: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    featureContainer: {
        paddingLeft: 18
    },
    wrapPin: {
        flex: 1
    },
    containerAllBtnPopup: {
        flexDirection: 'row-reverse'
    },
    containerItemBtnPopup: {
        backgroundColor: COLORS.RED_2,
        borderColor: COLORS.RED_2,
        borderRadius: 20
    },
    containerCancelBtnPopup: {
        borderColor: COLORS.GRAY_13,
        borderRadius: 20
    },
    textCancel: {
        color: COLORS.GRAY_12
    },
    feedBack: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: COLORS.WHITE,
        padding: 16,
        marginVertical: 20,
        marginTop: 16,
        borderRadius: 20
    },
    textTitleFeed: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 5
    },
    textTitleDescriptionFeed: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY,
        marginBottom: 10
    },
    starLeft: {
        flex: 2
    },
    wrapNameVerify: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        paddingLeft: 24,
        paddingRight: 18
    }
}), []);

export const MyStylesPinCodeProfile = () => useMemo(() => StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.TRANSPARENT
    },
    title: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size32,
        fontFamily: Configs.FontFamily.medium
    },
    buttons: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        marginHorizontal: 15,
        borderColor: COLORS.GREEN,
        width: 65,
        height: 65,
        borderRadius: 35
    },
    pinContainer: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 10
    }
}), []);
