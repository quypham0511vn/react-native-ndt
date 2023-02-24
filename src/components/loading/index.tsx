import React from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { COLORS } from '@/theme';
import MyStyleLoading from './styles';
import IcLoading from '@/assets/image/ic_loading.gif';

const Loading = ({ isOverview, isWhite }: { isOverview?: boolean, isWhite?: boolean }) => {

    const styles = MyStyleLoading();
    return (
        <>
            {isOverview ?
                <View style={styles.overlay}>
                    <FastImage
                        style={styles.activityIndicator}
                        source={IcLoading} />
                </View> :
                <View style={styles.inline} >
                    <ActivityIndicator size="small" color={isWhite ? COLORS.WHITE : COLORS.GREEN} />
                </View>}
        </>
    );
};

export default Loading;
