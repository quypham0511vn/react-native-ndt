import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';

import { MyStylesBanner } from '@/components/banner/styles';
import { Touchable } from '@/components/elements/touchable';
import { BannerModel } from '@/models/banner';
import { IconSize } from '@/theme/iconsize';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import { TYPE_RESIZE } from '@/common/constants';

const Banner = ({ banners }: any) => {
    const styles = MyStylesBanner();
    const renderBannerItem = useCallback(({ item }: { item: BannerModel }) => {

        const onOpenLink = () => {
            Utils.openURL(item.link);
        };

        return (
            <Touchable onPress={onOpenLink}
                disabled={!item.link}>
                <FastImage
                    source={{ uri: item.image_mobile || item.image_mb }}
                    resizeMode={TYPE_RESIZE.COVER}
                    style={styles.bannerImage} />
            </Touchable>
        );
    }, [styles.bannerImage]);
    
    const renderBanner = useMemo(() => <View style={styles.bannerContainer}>
        {banners && <Carousel
            data={banners}
            renderItem={renderBannerItem}
            sliderWidth={SCREEN_WIDTH + 20}
            itemWidth={IconSize.sizeBanner.width}
            autoplay
            loop
            autoplayDelay={2500}
        />}
    </View>, [banners, renderBannerItem, styles.bannerContainer]);

    return (
        renderBanner
    );
};

export default Banner;
