import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { COLORS, Styles } from '@/theme';
import { Configs, HEADER_PADDING } from '@/common/Configs';


export const MyStylesHome = () => useMemo(() =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.WHITE_GRAY1
        },
        imageBg: {
            height: SCREEN_HEIGHT / 3.7
        },
        headerContainer:{
            flex: 1,
            width: '100%'
        },
        txtCenter: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            color: COLORS.GRAY_7,
            marginTop: 10,
            marginBottom: 8,
            marginHorizontal: 15
        },
        txtNews: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            color: COLORS.GRAY_7,
            marginBottom: 8
        },
        marginHorizontal: {
            marginHorizontal: 15
        },
        viewTop: {
            width: '100%',
            paddingHorizontal: 16,
            paddingTop: 2
        },
        topInvestorContainer: {
            width: '100%',
            paddingHorizontal: 16,
            marginTop: HEADER_PADDING + 3,
            justifyContent: 'space-between',
            flexDirection: 'row'
        },
        circleWrap: {
            width: SCREEN_WIDTH * 0.09,
            height: SCREEN_WIDTH * 0.09,
            borderRadius: SCREEN_WIDTH * 0.15 / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.WHITE
        },
        fastImage: {
            width: SCREEN_WIDTH * 0.08,
            height: SCREEN_WIDTH * 0.08,
            borderRadius: SCREEN_WIDTH * 0.15 / 2
        },
        viewTopCenter: {
            width: '100%',
            alignItems: 'center'
        },
        topScreenUnAuthn: {
            flex: 1,
            paddingTop: HEADER_PADDING + 3,
            alignItems: 'center',
            width: '100%'

        },
        txtSumInvest: {
            ...Styles.typography.medium,
            color: COLORS.WHITE,
            fontSize: Configs.FontSize.size16
        },
        txtSumInvestValue: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size24,
            color: COLORS.WHITE
        },
        txtSumProfit: {
            ...Styles.typography.regular,
            color: COLORS.WHITE
        },
        txtVND: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size16,
            color: COLORS.WHITE,
            marginBottom: 2
        },
        txtVNDSmall: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size12,
            color: COLORS.WHITE,
            marginBottom: 3
        },
        txtVNDRemainingOrigin: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size12,
            color: COLORS.WHITE,
            marginBottom: 1
        },
        txtTitleUtility: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            color: COLORS.RED_2,
            paddingBottom: 8
        },
        txtDescribeUtility: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_7
        },
        txtForEachTitleQuestion: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_7,
            marginRight: 8
        },
        txtReason: {
            ...Styles.typography.regular,
            color: COLORS.GRAY_7,
            paddingVertical: 5
        },
        viewReason: {
            marginBottom: 20,
            backgroundColor: COLORS.WHITE,
            marginHorizontal: 16,
            padding: 8,
            borderRadius: 8
        },
        viewBottom: {
            marginBottom: 15
        },
        txtTotalInterestReceived: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size20,
            color: COLORS.WHITE
        },
        txtTotalRemainingOrigin: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size16,
            color: COLORS.WHITE
        },
        txtTotalInterestExtant: {
            ...Styles.typography.medium,
            fontSize: Configs.FontSize.size20,
            color: COLORS.WHITE
        },
        txtLeft: {
            marginLeft: '25%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        txtRight: {
            marginRight: '25%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: '5%'
        },
        wrapRow: {
            flexDirection: 'row',
            marginTop: 8
        },
        viewSumInvestValue: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'center',
            paddingHorizontal: 16
        },
        viewSumInvestValueCenter: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center'
        },
        allInvestContainer: {
            alignItems: 'center'
        },
        wrapTotalInterest: {
            alignItems: 'center',
            width: '50%'
        },
        viewSmallMenuLoginAndroid: {
            flexDirection: 'row',
            width: '92%',
            backgroundColor: COLORS.WHITE,
            borderRadius: 25,
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 5
        },
        viewSmallMenuLoginIOS: {
            ...Styles.shadow,
            flexDirection: 'row',
            width: '92%',
            backgroundColor: COLORS.WHITE,
            borderRadius: 25,
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 5
        },
        tab: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        txtTab: {
            ...Styles.typography.medium,
            color: COLORS.GRAY_12,
            paddingTop: 3
        },
        viewCenter: {
            marginHorizontal: 15,
            marginBottom: 20
        },
        newsItem: {
            ...Styles.shadow,
            width: SCREEN_WIDTH / 1.7,
            borderRadius: 10,
            marginHorizontal: 5,
            paddingBottom: 5
        },
        communicationImage: {
            width: SCREEN_WIDTH / 1.7,
            height: (SCREEN_WIDTH / 1.7 / 215) * 104,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
        },
        newsContainer: {
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 20
        },
        txtCommunityTitle: {
            ...Styles.typography.medium,
            marginTop: 10,
            paddingHorizontal: 5
        },
        txtCommunityDes: {
            ...Styles.typography.regular,
            fontSize: Configs.FontSize.size11,
            color: COLORS.LIGHT_GRAY,
            marginVertical: 5,
            paddingHorizontal: 5
        },
        more: {
            width: '100%',
            paddingVertical: 10,
            marginBottom: 10,
            alignItems: 'center'
        },
        utilityWrap: {
            ...Styles.shadow,
            flexDirection: 'row',
            backgroundColor: COLORS.WHITE,
            borderRadius: 15,
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
        },
        txtUtility: {
            flex: 1,
            flexDirection: 'column',
            paddingLeft: 20,
            paddingVertical: 16
        },
        viewBanner: {
            marginTop: SCREEN_WIDTH * 0.02
        },
        viewTxtBottom: {
            width: '100%',
            paddingHorizontal: 16
        },
        txtLogin: {
            fontSize: Configs.FontSize.size16,
            color: COLORS.GREEN,
            fontFamily: Configs.FontFamily.bold,
            textAlign: 'center'
        },
        tobAuth: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12
        },
        txtHello: {
            fontFamily: Configs.FontFamily.medium,
            color: COLORS.WHITE
        },
        txtName: {
            fontFamily: Configs.FontFamily.medium,
            fontSize: Configs.FontSize.size32,
            color: COLORS.WHITE
        },
        txtInvest: {
            fontFamily: Configs.FontFamily.medium,
            fontSize: Configs.FontSize.size20,
            color: COLORS.WHITE
        },
        viewForeground: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        logoTienNgay: {
            alignSelf: 'flex-start',
            marginHorizontal: 16
        },
        imgNotify: {
            width: SCREEN_WIDTH * 0.08
        }
    }
    ), []);
