import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Lightbox from 'react-native-lightbox-v2';
import QRCode from 'react-native-qrcode-svg';

import { LINKS } from '@/api/constants';
import ShareIC from '@/assets/image/ic_share_friends.svg';
import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import SessionManager from '@/manager/SessionManager';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { MyStylesShareFriend } from './styles';
import ToastUtils from '@/utils/ToastUtils';
import { useAppStore } from '@/hooks';

const ShareFriend = observer(() => {
    const {userManager} = useAppStore();
    const styles = MyStylesShareFriend();
    const [code, setCode] = useState<string>(SessionManager.userInfo?.phone_number || '');

    const refLink = userManager?.userInfo?.link_refferral || LINKS.ONE_LINK;

    const renderContent = useCallback(() => 
        <QRCode
            value={LINKS.ONE_LINK}
            size={SCREEN_WIDTH}
            quietZone={Configs.FontSize.size12}
        />, []);

    const share = useCallback(() => {
        Utils.share(LINKS.ONE_LINK);
    }, [code]);

    const copyToClipboard = useCallback((text: string) => {
        Utils.copyClipboard(text);
        ToastUtils.showMsgToast(Languages.errorMsg.copied);
    }, []);

    const renderItem = useCallback((label: string, value: string) => {

        const onPress = () => {
            copyToClipboard(value);
        };

        return (
            <>
                <Text style={iStyles.txtLabel}>{label}</Text>
                <View style={iStyles.wrapItem}>
                    <Text style={iStyles.txtValue}>{value}</Text>
                    <Touchable onPress={onPress} style={iStyles.btCopy}>
                        <Text style={iStyles.txtCopy}>{Languages.transferScreen.copy}</Text>
                    </Touchable>
                </View>
            </>
        );
    }, [copyToClipboard]);

    return (
        <View style={styles.container}>
            <HeaderBar isLight={false} title={Languages.shareFriend.introduce} hasBack />
            <View style={styles.wrapAllContent}>
                <HTMLView
                    value={Languages.shareFriend.introduceContent}
                    stylesheet={HtmlStyles || undefined}
                />
                {renderItem(Languages.shareFriend.introduceCode, code)}
                {renderItem(Languages.shareFriend.linkDownload, refLink)}
                <View style={styles.wrapQR}>
                    <Text style={styles.txtQR}>{Languages.shareFriend.qrCode}</Text>
                    <Lightbox
                        renderContent={renderContent}
                        springConfig={{ tension: 90000000, friction: 9000000 }}
                        swipeToDismiss={true}>
                        <QRCode
                            value={refLink}
                            size={SCREEN_WIDTH * 0.75}
                            quietZone={Configs.FontSize.size16}
                        />
                    </Lightbox>
                </View>
            </View>
        </View >
    );
});

export default ShareFriend;

const iStyles = StyleSheet.create({
    txtLabel: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        marginTop: 10,
        color: COLORS.GRAY_12
    },
    btCopy: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: COLORS.GREEN,
        borderRadius: 25
    },
    txtCopy: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        color: COLORS.WHITE
    },
    txtValue: {
        ...Styles.typography.bold,
        color: COLORS.GRAY_7,
        flex: 1
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 5
    },
});

