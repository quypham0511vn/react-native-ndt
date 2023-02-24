import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { observer } from 'mobx-react';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/common/Configs';

const NoData = observer(({ img, description }: { img?: any, description?: string }) => (
    <View style={styles.container}>
        {img}
        <Text style={styles.description}>{description}</Text>
    </View>
));

export default NoData;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: COLORS.TRANSPARENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description:{
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GRAY_7,
        paddingTop: 26,
        textAlign: 'center'
    }
});
