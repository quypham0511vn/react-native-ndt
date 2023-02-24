import {StyleSheet} from 'react-native';
import {useMemo} from 'react';

import {COLORS} from '@/theme';
import { PADDING_BOTTOM, Configs } from '@/common/Configs';

const ITEM_HEIGHT = Configs.FontSize.size40;

const MyStyleBottomSheet = () => useMemo(() =>
    StyleSheet.create({
        contentContainer: {
            flex: 1
        },
        flatList: {
            flex: 1,
            borderTopColor: COLORS.GRAY_6,
            paddingHorizontal: 5
        },
        flatListContainer: {
            paddingHorizontal: 15,
            paddingBottom: PADDING_BOTTOM
        },
        input: {
            justifyContent: 'center',
            paddingHorizontal: 5,
            height: 40,
            width: '90%',
            color: COLORS.BACKDROP
        },
        item: {
            height: ITEM_HEIGHT,
            justifyContent: 'center'
        },
        searchContainer: {
            height: ITEM_HEIGHT,
            marginBottom: 10,
            marginHorizontal: 15,
            paddingHorizontal: 15,
            flexDirection: 'row',
            borderRadius: 10,
            backgroundColor: COLORS.GRAY_2
        },
        checkbox: {
            width: 20,
            height: 20,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapCheckbox: {
            flexDirection: 'row',
            height: ITEM_HEIGHT,
            alignItems: 'center'
        },
        txt: {
            justifyContent: 'center',
            color: COLORS.BLACK
        },
        wrapIcon: {
            justifyContent: 'center',
            alignItems: 'center'
        }
    }),[]);
export default MyStyleBottomSheet;
