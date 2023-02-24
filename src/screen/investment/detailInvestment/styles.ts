import { StyleSheet } from 'react-native';

import { Configs } from '@/common/Configs';
import { Styles } from '@/theme';
import { COLORS } from '@/theme/colors';
import DimensionUtils from '@/utils/DimensionUtils';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        minHeight: DimensionUtils.SCREEN_HEIGHT
    },
    wrapContent: {
        marginHorizontal: 16
    },
    scroll: {
        paddingBottom: 10
    },
    title: {
        ...Styles.typography.regular,
        textAlign: 'center',
        fontSize: Configs.FontSize.size18,
        color: COLORS.GRAY_7,
        marginBottom: 10
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapInfo: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        paddingTop: 16,
        paddingBottom: 4,
        marginBottom: 30,
        width: '100%'
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        alignItems: 'center'
    },
    label: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    txtValue: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        fontSize:Configs.FontSize.size16
    },
    wrapIcon: {
        alignSelf: 'center',
        paddingVertical: 16
    },
    wrapItemInfo: {
        alignItems: 'flex-end'
    },
    txtDate: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size10,
        color: COLORS.GRAY_12
    },
    txtDue: {
        ...Styles.typography.regular
    },
    button: {
        width: '100%',
        backgroundColor: COLORS.GREEN,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    }
});
export default styles;
