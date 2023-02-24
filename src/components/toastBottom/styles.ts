import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { COLORS } from '@/theme';


const MyStylesToast = () => useMemo(() =>
    StyleSheet.create({
        toast: {
            borderRadius: 10,
            padding: 10,
            position: 'absolute',
            bottom: 5,
            backgroundColor: COLORS.GRAY
        }
    }), []
);

export default MyStylesToast;
