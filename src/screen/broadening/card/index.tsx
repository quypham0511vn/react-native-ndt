import React from 'react';
import { Animated, ImageBackground, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import LogoBroadening from '@/assets/image/broadening/logo_broadening.svg';
import Images from '@/assets/Images';
import { isIOS } from '@/common/Configs';
import Languages from '@/common/Languages';
import { Touchable } from '@/components/elements/touchable';
import { COLORS } from '@/theme';
import { ACTION_OFFSET, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { MyStylesCard } from './styles';
import { TYPE_RESIZE } from '@/common/constants';

type ItemProps = {
    name: string
    source?: any
    icons?: any
    isFirst?: boolean
    swipe?: any
    tiltSign?: any
    txt: string
    handleChoice?: () => any,
    rest?: any

};

export default function Card({
    name,
    source,
    isFirst,
    swipe,
    tiltSign,
    txt,
    icons,
    handleChoice
}: ItemProps) {

    const styles = MyStylesCard();

    const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
        inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
        outputRange: ['4deg', '0deg', '-4deg']
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }]
    };

    return (
        <Animated.View
            style={isFirst && [animatedCardStyle, styles.gradient]}
        >
            <ImageBackground style={isIOS? styles.imageIOS : styles.imageANDROID} source={Images.bg_board} resizeMode={TYPE_RESIZE.STRETCH} >
                <Svg height="100%" width="100%"  >
                    <G id="circle">
                        <Circle
                            r={SCREEN_WIDTH * 0.6}
                            x={SCREEN_WIDTH * 0.2}
                            y={SCREEN_HEIGHT / 5}
                            fill={COLORS.WHITE}
                        />
                    </G>
                </Svg>
                <LogoBroadening
                    style={styles.logo}
                    width={SCREEN_WIDTH * 0.5}
                    height={SCREEN_WIDTH * 0.14}
                />
                {source}
                <View style={styles.viewBottom}>
                    <View style={styles.viewText}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.txt}>{txt}</Text>
                    </View>
                </View>
                <View style={isIOS ? styles.viewIOS : styles.viewANDROID} >
                    <Touchable style={isIOS ? styles.tobIOS : styles.tobANDROID} onPress={handleChoice}>
                        <Text style={styles.txtContinue}>{Languages.common.continue}</Text>
                    </Touchable>
                    {icons}
                </View>
            </ImageBackground>
        </Animated.View>
    );
}
