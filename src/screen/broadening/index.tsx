import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import IcBroad1 from '@/assets/image/broadening/ic_broad1.svg';
import IcBroad2 from '@/assets/image/broadening/ic_broad2.svg';
import IcBroad3 from '@/assets/image/broadening/ic_broad3.svg';
import IcIndex1 from '@/assets/image/broadening/ic_index1.svg';
import IcIndex2 from '@/assets/image/broadening/ic_index2.svg';
import IcIndex3 from '@/assets/image/broadening/ic_index3.svg';
import Images from '@/assets/Images';
import Languages from '@/common/Languages';
import ScreenName from '@/common/screenNames';
import SessionManager from '@/manager/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { CARD, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Card from './card';
import { MyStylesBoar } from './styles';
import { TYPE_RESIZE } from '@/common/constants';

export default function Broadening() {
    const styles = MyStylesBoar();
    const arr = [
        {
            title: Languages.board.title1,
            images: <IcBroad1
                style={styles.iconBig}
                width={SCREEN_WIDTH * 0.6}
                height={SCREEN_WIDTH * 0.6}
            />,
            icon: <IcIndex1 />,
            txt: Languages.board.txt1
        },
        {
            title: Languages.board.title2,
            images: <IcBroad2
                style={styles.iconBig}
                width={SCREEN_WIDTH * 0.6}
                height={SCREEN_WIDTH * 0.6}
            />,
            icon: <IcIndex2 />,
            txt: Languages.board.txt2
        },
        {
            title: Languages.board.title3,
            images: <IcBroad3
                style={styles.iconBig}
                width={SCREEN_WIDTH * 0.6}
                height={SCREEN_WIDTH * 0.6}
            />,
            icon: <IcIndex3 />,
            txt: Languages.board.txt3
        }
    ];

    const swipe = useRef(new Animated.ValueXY()).current;
    const tiltSign = useRef(new Animated.Value(1)).current;
    const [data, setData] = useState(arr);

    useEffect(() => {
        if (data.length === 0) {
            setData(arr);
        }
    }, [data]);

    const transitionNext = useCallback(() => {
        setData((prevState) => prevState.slice(1));
        swipe.setValue({ x: 0, y: 0 });
    }, [swipe]);

    const handleChoice = useCallback(
        (name: string, sign: number) => {
            if ((name !== Languages.board.title3)) {
                Animated.timing(swipe.x, {
                    duration: 500,
                    toValue: sign * CARD.CARD_OUT_WIDTH,
                    useNativeDriver: true
                }).start(transitionNext);
            } else {
                SessionManager.setSkipOnboarding();
                Navigator.replaceScreen(ScreenName.tabs);
            }
        },
        [swipe.x, transitionNext]
    );

    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const renderItemFlatList = useCallback(({ item, index}: any) => (

        <Card
            key={item.title}
            name={item.title}
            source={item.images}
            icons={item.icon}
            isFirst={index > 0}
            swipe={swipe}
            tiltSign={tiltSign}
            txt={item.txt}
            handleChoice={() => { handleChoice(item.title, -1.8); }}
        />
    ), [handleChoice, swipe, tiltSign]);

    return (
        <Animated.View style={styles.main}>
            <StatusBar
                barStyle={'dark-content'}
                animated
                translucent
                backgroundColor={COLORS.TRANSPARENT}
            />
            <ImageBackground style={styles.main} source={Images.bg_board} resizeMode={TYPE_RESIZE.STRETCH} >
                <FlatList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    renderItem={renderItemFlatList}
                />
            </ImageBackground>
        </Animated.View>
    );
}
