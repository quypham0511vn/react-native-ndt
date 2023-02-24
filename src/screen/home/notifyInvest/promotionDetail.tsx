import React from 'react';
import { Text, View } from 'react-native';

import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import HeaderBar from '@/components/header';
import { MyImageView } from '@/components/image';
import { PromotionModel } from '@/models/banner';
import { COLORS, IconSize, RenderHtmlStyle } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import RenderHTML from 'react-native-render-html';
import { MyStylesNotifyInvest } from './styles';

export const PromotionDetail = ({ route }: any) => {
    const { data } : {data : PromotionModel} = route?.params;

    const styles = MyStylesNotifyInvest();

    const source = `<div style="font-family: '${Configs.FontFamily.regular}'; 
    font-size: ${Configs.FontSize.size13}px; color: ${COLORS.BLACK}; padding-right: 5px; padding-left: 5px;">
            ${data.body}
          </div>`

    return (
        <View style={styles.containerDetail}>
            <HeaderBar title={Languages.invest.notifyPromotion} hasBack />

            {data.image && <MyImageView
                imageUrl={data.image}
                style={IconSize.sizeNotifyDetail}
                resizeMode={'cover'}
            />}

            <Text style={styles.titlePromotionDetail} numberOfLines={1}>{data?.title}</Text>

            <RenderHTML
                contentWidth={SCREEN_WIDTH}
                source={{ html: source }}
                systemFonts={[Configs.FontFamily.regular]}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={RenderHtmlStyle}
            />
        </View>
    );
};

