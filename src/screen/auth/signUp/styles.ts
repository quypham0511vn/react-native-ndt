import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs, PADDING_TOP } from '@/common/Configs';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';

export const MyStylesSign = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        width: '95%'
    },
    main: {
        flex: 1,
        backgroundColor: COLORS.GREEN,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    scrollView: {
        marginTop: SCREEN_HEIGHT * 0.01,
        width: '100%',
        paddingRight: '5%'
    },
    wrapLoginTxt: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtTitleModal: {
        ...Styles.typography.regular,
        color: COLORS.GRAY,
        marginHorizontal: 20
    },
    inputPass: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: Configs.FontSize.size40,
        marginTop: 10
    },
    inputChannel: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: Configs.FontSize.size40,
        marginTop: 10
    },
    containerOverViewPicker: {
        borderRadius: 20,
        borderWidth: 1 ,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: Configs.FontSize.size40,
        borderColor: COLORS.GRAY_11
    },
    valuePicker:{
        ...Styles.typography.regular,
        color: COLORS.GRAY_12                
    },
    containerPicker:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15
    },
    containerPlaceholderPicker:{
    },
    rowInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        height: '20%'
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    wrapAll: {
        flex: 1,
        paddingBottom: PADDING_TOP,
        marginTop: SCREEN_HEIGHT / 3,
        height: SCREEN_HEIGHT / 3,
        width: '80%',
        position: 'absolute',
        top: -20
    },
    checkbox: {
        justifyContent: 'flex-end',
        marginTop: 10,
        width: 30,
        height: 30,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
        marginTop: -10
    },
    content: {
        justifyContent: 'center',
        width: '100%',
        height: '120%'
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    button: {
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 15
    },
    txtSave: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        marginLeft: 10
    },
    txtSubmit: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GRAY_7,
        marginRight: 6
    },
    tobLogin: {
        width: SCREEN_WIDTH * 0.4,
        height: Configs.FontSize.size40,
        backgroundColor: COLORS.GREEN,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewBottom: {
        flexDirection: 'row',
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.5,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.1,
        alignItems: 'center'
    },
    txtLogin: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        alignSelf:'flex-start',
        color: COLORS.RED,
        marginHorizontal: 10,
        paddingBottom: 10
    }
}), []);
