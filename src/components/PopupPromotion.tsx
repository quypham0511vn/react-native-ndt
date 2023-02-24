import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {
    Animated, Dimensions,
    StyleSheet,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

import { Configs } from '@/common/Configs';
import { TYPE_RESIZE } from '@/common/constants';
import { COLORS } from '@/theme';

import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import Carousel from "react-native-snap-carousel";
import { Touchable } from './elements/touchable';
import Navigator from '@/routers/Navigator';
import ScreenName from '@/common/screenNames';
import { PromotionModel } from '@/models/banner';

export type PopupPromotionProps = {
    onConfirm?: () => any;
    data?: PromotionModel[];
};

export type PopupActions = {
    show: (content?: string) => any;
    hide: (content?: string) => any;
    setContent?: (message: string) => void;
};

const PopupPromotion = forwardRef<PopupActions, PopupPromotionProps>(
    ({
        onConfirm,
        data
    }: PopupPromotionProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const scrollX = React.useRef(new Animated.Value(0)).current;

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const onPress = useCallback(() => {
            onConfirm?.();
            hide();
        }, [hide, onConfirm]);

        const onClose = useCallback(() => {
            hide();
        }, [hide]);

        const onSnapToItem = useCallback(
            (index) => {
                scrollX.setValue(index * SCREEN_WIDTH);
            },
            [scrollX]
        );

        const renderItem = useCallback(({ item }: { item: PromotionModel }) => {
            const onPress = () => {
                onClose();
                Navigator.pushScreen(ScreenName.promotionDetail, {data: item})
            }
            return <Touchable onPress={onPress}>
            <FastImage
                style={{
                    width: IMG_WIDTH,
                    height: IMG_HEIGHT,
                }}
                source={{ uri: item.image_popup }}
                resizeMode={TYPE_RESIZE.COVER}
            />
        </Touchable>
        }, []);

        return (
            <Modal
                style={{ marginHorizontal: 0 }}
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
                onBackdropPress={onClose}
                coverScreen={true}>
                <View>
                    <View style={styles.bannerContainer}>
                        <Carousel
                            data={data}
                            renderItem={renderItem}
                            sliderWidth={SCREEN_WIDTH}
                            itemWidth={IMG_WIDTH}
                            autoplay
                            autoplayDelay={15000}
                            onSnapToItem={onSnapToItem}
                            layout={"default"}
                        />
                    </View>

                    {data?.length > 1 && <ExpandingDot
                        data={data}
                        expandingDotWidth={40}
                        inActiveDotOpacity={0.6}
                        scrollX={scrollX}
                        dotStyle={styles.dotStyle}
                        containerStyle={styles.containerStyle}
                        activeDotColor={COLORS.GREEN}
                        inActiveDotColor={COLORS.GRAY_3}
                    />}
                </View>
            </Modal>
        );
    });
export default PopupPromotion;

const IMG_WIDTH = Dimensions.get('screen').width / 1.3;
const IMG_HEIGHT = IMG_WIDTH / 0.75;

const styles = StyleSheet.create({
    mainContainer: {
        width: IMG_WIDTH,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    confirm_button_wrapper: {
        alignSelf: 'center',
        backgroundColor: COLORS.GREEN,
        width: IMG_WIDTH,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        fontSize: 16,
        color: COLORS.WHITE,
        textAlign: 'center',
        fontFamily: Configs.FontFamily.bold
    },
    dotStyle: {
        width: 10,
        height: 7,
        backgroundColor: COLORS.GREEN,
        borderRadius: 15,
    },
    containerStyle: {
        bottom: 0,
        position: "absolute",
    },
    bannerContainer: {
        paddingBottom: 15,
    },
});
