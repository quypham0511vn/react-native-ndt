import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

import { Configs } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';


export const MyStylesVerifyOTP = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5,
        justifyContent: 'center'
    },
    wrapAllContent: {
        flex: 2,
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 140,
        alignItems:'center'
    },
    logo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    reSendCodeText: {
        ...Styles.typography.regular,
        color: COLORS.RED_4,
        textAlign: 'center',
        paddingVertical: 20
    },
    underlineStyleBase: {
        width: 50,
        height: 50,
        ...Styles.typography.regular,
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        borderRadius: 30,
        color: COLORS.BLACK,
        backgroundColor: COLORS.WHITE,
        fontSize: Configs.FontSize.size16
    },
    underlineStyleHighLighted: {
        borderColor: COLORS.GREEN,
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        borderWidth: 1,
        color: COLORS.GREEN
    },
    wrapOTp: {
        height: SCREEN_HEIGHT * 0.02,
        width: '90%',
        marginVertical: 20,
        alignItems: 'center'
    },
    wrapReSendOtp:{
        paddingVertical: 20,
        width: '40%'
    },
    reSendOtpTXT:{
        ...Styles.typography.regular,
        color: COLORS.RED_4,
        textAlign: 'center'
    }
}), []);
