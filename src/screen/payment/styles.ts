import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

import { COLORS } from '@/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_5
    },
    topBarContainer: {
        backgroundColor: COLORS.GRAY_13,
        borderRadius: 26,
        marginHorizontal: 16,
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    filterItem: {
        paddingHorizontal: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 20
    },
    arrow: {
        marginTop: 6
    },
    wrapFlatList: {
    },
    wrapNoData: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: SCREEN_HEIGHT / 2
    }
});
