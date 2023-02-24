import {useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {IconSize} from '@/theme';

export const MyStylesBanner = () => useMemo(() =>
    StyleSheet.create({
        bannerContainer: {
            height: IconSize.sizeBanner.height,
            marginTop: 25,
            marginLeft: -20
        },
        bannerImage: {
            ...IconSize.sizeBanner,
            borderRadius: 10
        }
    }), []);
