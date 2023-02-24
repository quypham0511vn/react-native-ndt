import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import { COLORS, Styles } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';

export const MyStylesEditAccountInfo = () => useMemo(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    wrapContent: {
        marginTop: 16
    },
    wrapEdit: {
        paddingHorizontal: 16,
        width: '100%',
        paddingTop: 25,
        paddingBottom: 20
    },
    topContainer: {
        marginVertical: SCREEN_HEIGHT * 0.02,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SCREEN_HEIGHT * 0.03
    },
    wrapInput: {
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 5
    },
    wrapBirthday: {
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 7
    },
    accuracyWrap: {
        width: '100%',
        borderRadius: 70,
        alignItems: 'center',
        marginTop: 5,
        paddingVertical: 8
    },
    txtAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        paddingHorizontal: 40
    },
    circleWrap: {
        width: SCREEN_WIDTH * 0.4 - 25,
        height: SCREEN_WIDTH * 0.4 - 25,
        borderRadius: SCREEN_WIDTH * 0.4 - 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        borderColor: COLORS.GREEN,
        flex:1
    },
    noCircleWrap: {
        width: SCREEN_WIDTH * 0.4 - 25,
        height: SCREEN_WIDTH * 0.4 - 25,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.GREEN
    },
    inputStyle: {
        borderWidth: 1,
        borderRadius: 30,
        marginVertical: 5
    },
    labelStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    labelBirthdayStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingBottom: 8
    },
    placeHolderBirthday:{
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    placeHolderValueBirthday:{
        ...Styles.typography.regular,
        paddingVertical: 4,
        paddingHorizontal: 10,
        color: COLORS.GRAY_7
    },
    containerDateDisable:{
        width: '100%',
        backgroundColor: COLORS.GRAY_2
    },
    containerDate:{
        width: '100%'
    },
    containerItemFilter: {
        marginBottom: 8,
        marginTop: -8
    },
    rowItemFilter: {
        backgroundColor: COLORS.WHITE,
        width: '100%',
        borderColor: COLORS.GRAY_11,
        borderRadius: 20,
        marginVertical: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    rowItemFilterDisable: {
        backgroundColor: COLORS.GRAY_2,
        width: '100%',
        borderColor: COLORS.GRAY_11,
        borderRadius: 20,
        marginVertical: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    valuePicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_1
    },
    valuePickerDisable: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    placeHolderPicker: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_16
    },
    textErrorGender:{
        paddingHorizontal: 9,
        marginTop: 7,
        marginBottom: -12
    }
}), []);
