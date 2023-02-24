import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { COLORS } from '@/theme';

const MyStyleLoading = () => useMemo(() =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 10000,
            width: '100%',
            height: '100%'
        },
        inline: {
            marginVertical: 10,
            alignItems: 'center'
        },
        activityIndicator: {
            width: 100,
            height: 100,
            borderRadius: 10,
        },
        activityIndicatorSmall: {
            width: 50,
            height: 50,
            borderRadius: 10,
        }
    })

, []);
export default MyStyleLoading;
