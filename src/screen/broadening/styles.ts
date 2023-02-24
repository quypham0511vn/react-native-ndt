import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { COLORS } from '@/theme';

export const MyStylesBoar = () => useMemo(() => StyleSheet.create({
    container: {
        backgroundColor: COLORS.WHITE,
        alignItems: 'center'
    },
    main: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 1.5
    },
    iconBig: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.15,
        left: SCREEN_WIDTH * 0.01
    }
}), []);

