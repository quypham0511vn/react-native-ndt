import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import Images from '@/assets/Images';
import IcPersion from '@/assets/image/auth/ic_persion.svg';
import IcCongratulation from '@/assets/image/auth/ic_congratulation.svg';
import LogoBroadening from '@/assets/image/broadening/logo_broadening.svg';
import { isIOS } from '@/common/Configs';
import Languages from '@/common/Languages';
import { COLORS } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '@/components/elements/touchable';
import Navigator from '@/routers/Navigator';
import ScreenName, { TabNamesArray } from '@/common/screenNames';
import { MyStylesSignSuccess } from './styles';
import { TYPE_RESIZE } from '@/common/constants';

export const SuccessSignUp = (props: any) => {
    const styles = MyStylesSignSuccess();

    const gotoHome = () => {
        Navigator.navigateToDeepScreen(
            [ScreenName.tabs], TabNamesArray[0]
        );
    };

    return (
        <ImageBackground style={isIOS ? styles.imageIOS : styles.imageANDROID} source={Images.bg_board} resizeMode={TYPE_RESIZE.STRETCH}>

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
            <IcCongratulation
                style={styles.logoText}
                width={SCREEN_WIDTH * 0.5}
                height={SCREEN_WIDTH * 0.14} />
            <IcPersion
                style={styles.logoPersion}
                width={SCREEN_WIDTH * 0.5}
                height={SCREEN_WIDTH * 0.5}
            />
            <View style={styles.main}>
                <Text style={styles.txtSuccess}>{Languages.auth.succuss}</Text>
                <Text style={styles.txtNotifySuccess}>{Languages.auth.notifySuccess}</Text>
            </View>
            <View style={isIOS ? styles.viewIOS : styles.viewANDROID}>
                <Touchable onPress={gotoHome} style={styles.tobContinue}>
                    <Text style={styles.txtContinue}>{Languages.auth.continue}</Text>
                </Touchable>
            </View>
        </ImageBackground>
    );
};

