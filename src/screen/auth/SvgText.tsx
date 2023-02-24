import { observer } from 'mobx-react';
import * as React from 'react';
import { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, G, Svg, Text, TextPath, TSpan } from 'react-native-svg';

import { COLORS } from '@/theme';
import Languages from '@/common/Languages';
import { Configs } from '@/common/Configs';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { useAppStore } from '@/hooks';
import HideKeyboard from '@/components/HideKeyboard';

const ratio = SCREEN_HEIGHT / SCREEN_WIDTH;

const SvgComponent = observer((props: any) => {
    const { common } = useAppStore();
    const [login, setLogin] = useState<boolean>(true);
    const [signUp, setSignUp] = useState<boolean>(false);
    const [forgotPwd, setForgotPwd] = useState<boolean>(false);
    const [key, setKey] = useState<string>('');
    const [r, setR] = useState<number>(0);
    const [x, setX] = useState<number>(0);
    const [dx, setDx] = useState<number>(0);
    const [dx2, setDx2] = useState<number>(0);
    const [dx3, setDx3] = useState<number>(0);
    const [dx1, setDx1] = useState<number>(0);

    useEffect(() => {
        if (props.title) {
            if (props.title === Languages.auth.txtLogin) {
                setSignUp(false);
                setLogin(true);
                setForgotPwd(false);
            } else if (props.title === Languages.auth.txtSignUp) {
                setSignUp(true);
                setLogin(false);
                setForgotPwd(false);
            }
            else {
                setSignUp(false);
                setLogin(false);
                setForgotPwd(true);
            }
        }
        if (props.onNavigate) {
            props.onNavigate(key);
        }
    }, [props.onNavigate, key]);

    useEffect(() => {
        if (common.successChangePass) {
            setSignUp(false);
            setLogin(true);
            setForgotPwd(false);
            setKey(Languages.auth.txtLogin);
            common.setSuccessChangePass(false);
        }
    }, [common.successChangePass]);

    useLayoutEffect(() => {
        if (ratio < 1.7) {
            setR(SCREEN_WIDTH * 0.54);
            setX(SCREEN_WIDTH * 0.2);
            setDx1(SCREEN_WIDTH * 0.54 * 5.99);
            setDx2(SCREEN_WIDTH * 0.54 * 5.06);
            setDx3(SCREEN_WIDTH * 0.54 * 0.46);
            setDx(0);
        } else if (ratio >= 1.7 && ratio < 2) {
            setR(SCREEN_WIDTH * 0.6);
            setX(SCREEN_WIDTH * 0.2);
            setDx1(SCREEN_WIDTH * 0.6 * 6.04);
            setDx2(SCREEN_WIDTH * 0.6 * 5.17);
            setDx3(SCREEN_WIDTH * 0.6 * 0.55);
            setDx(0.6 * 0.06);
        } else if (ratio >= 2 && ratio < 2.1) {
            setR(SCREEN_WIDTH * 0.63);
            setX(SCREEN_WIDTH * 0.22);
            setDx(SCREEN_WIDTH * 0.63 * 0.025);
            setDx1(SCREEN_WIDTH * 0.63 * 6.07);
            setDx2(SCREEN_WIDTH * 0.63 * 5.17);
            setDx3(SCREEN_WIDTH * 0.63 * 0.55);
        }
        else if (ratio >= 2.1) {
            setR(SCREEN_WIDTH * 0.63);
            setX(SCREEN_WIDTH * 0.22);
            setDx(SCREEN_WIDTH * 0.63 * 0.03);
            setDx1(SCREEN_WIDTH * 0.63 * 6.07);
            setDx2(SCREEN_WIDTH * 0.63 * 5.17);
            setDx3(SCREEN_WIDTH * 0.63 * 0.55);
        }
    }, []);

    const onNavigateLogin = useCallback(() => {
        setSignUp(false);
        setLogin(true);
        setForgotPwd(false);
        setKey(Languages.auth.txtLogin);
    }, []);

    const onNavigateSignUp = useCallback(() => {
        setSignUp(true);
        setLogin(false);
        setForgotPwd(false);
        setKey(Languages.auth.txtSignUp);
    }, []);

    const onNavigateForgotPwd = useCallback(() => {
        setSignUp(false);
        setLogin(false);
        setForgotPwd(true);
        setKey(Languages.auth.forgotPwd);
    }, []);

    return (
        <HideKeyboard>
            <View style={styles.container}>
                <Svg height="100%" width="100%" {...props} >
                    <G id="circle">
                        <Circle
                            r={r}
                            x={x}
                            y={SCREEN_HEIGHT / 2}
                            fill={COLORS.WHITE}
                        />
                    </G>
                    <Text fill={login ? COLORS.WHITE : COLORS.GRAY}
                        fontSize={Configs.FontSize.size20}
                        onPressIn={onNavigateLogin}
                        delayPressIn={2}
                        key='1'
                        fontFamily={Configs.FontFamily.regular}
                        letterSpacing={Configs.FontSize.size4}
                        strokeWidth={70}
                        stroke={COLORS.NO_BACKDROP}

                    >
                        <TextPath href="#circle" >
                            <TSpan dx={dx2} dy={-15} fontStyle='normal'>
                                {Languages.auth.txtLogin}
                            </TSpan>
                        </TextPath>
                    </Text>
                    <Text fill={signUp ? COLORS.WHITE : COLORS.GRAY}
                        fontSize={Configs.FontSize.size20}
                        delayPressIn={2}
                        onPressIn={onNavigateSignUp}
                        key='2'
                        fontFamily={Configs.FontFamily.regular}
                        letterSpacing={Configs.FontSize.size4}
                        strokeWidth={70}
                        stroke={COLORS.NO_BACKDROP}
                    >
                        <TextPath href="#circle" >
                            <TSpan dx={dx1} dy={-15} fontStyle='normal'>
                                {Languages.auth.txtD}
                            </TSpan>
                        </TextPath>
                    </Text>

                    <Text fill={signUp ? COLORS.WHITE : COLORS.GRAY}
                        fontSize={Configs.FontSize.size22}
                        onPressIn={onNavigateSignUp}
                        delayPressIn={2}
                        key='3'
                        fontFamily={Configs.FontFamily.regular}
                        letterSpacing={Configs.FontSize.size4}
                        strokeWidth={70}
                        stroke={COLORS.NO_BACKDROP}
                    >
                        <TextPath href="#circle" >
                            <TSpan dx={dx} dy={-15} fontStyle='normal'>
                                {Languages.auth.txtK}
                            </TSpan>
                        </TextPath>
                    </Text>
                
                    <Text fill={forgotPwd ? COLORS.WHITE : COLORS.GRAY}
                        fontSize={Configs.FontSize.size22}
                        onPressIn={onNavigateForgotPwd}
                        delayPressIn={2}
                        key='4'
                        fontFamily={Configs.FontFamily.regular}
                        letterSpacing={Configs.FontSize.size4}
                        strokeWidth={70}
                        stroke={COLORS.NO_BACKDROP}
                    >
                        <TextPath href="#circle" >
                            <TSpan dx={dx3} dy={-15} fontStyle='normal' >
                                {Languages.auth.forgotPwd}
                            </TSpan>
                        </TextPath>
                    </Text>
                </Svg>
            </View>
        </HideKeyboard>
    );
});

export default SvgComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.TRANSPARENT
    }
});
