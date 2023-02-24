
import PasscodeAuth from '@el173/react-native-passcode-auth';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ImageBackground, RefreshControl, StatusBar, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import FastImage from 'react-native-fast-image';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { LINKS, STORE_LUCKY_LOTT } from '@/api/constants';
import LogoVfs from '@/assets/image/home/logo_vfs.svg';
import AvatarIC from '@/assets/image/ic_avatar.svg';
import LogoLuckyLott from '@/assets/image/logo_lucky_lott.svg';
import Images from '@/assets/Images';
import { isIOS } from '@/common/Configs';
import { ENUM_BIOMETRIC_TYPE, ENUM_INVEST_STATUS, LINK_TIENNGAY, TYPE_FORMAT_HEADER_BAR, TYPE_INTEREST_RECEIVE_ACC, TYPE_RESIZE } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabsName } from '@/common/screenNames';
import DraggableComponent from '@/components/Draggable';
import { Touchable } from '@/components/elements/touchable';
import { MyImageView } from '@/components/image';
import ItemInvest from '@/components/ItemInvest';
import Loading from '@/components/loading';
import PopupPromotion, { PopupActions } from '@/components/PopupPromotion';
import PopupVimo, { PopupAlertActions } from '@/components/PopupVimo';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import { PromotionModel, BannerModel, PromotionsModel } from '@/models/banner';
import { BaseModel } from '@/models/base-model';
import { DashBroad } from '@/models/dash';
import { PackageInvest } from '@/models/invest';
import { UserInfoModal } from '@/models/user-models';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import IcNotify from '../../assets/image/header/ic_notify_header_home.svg';
import LogoHome from '../../assets/image/header/logo_home.svg';
import NotificationListening from './NotificationListening';
import { MyStylesHome } from './styles';

const PAGE_SIZE = 4;

const Home = observer(() => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager,
        common
    } = useAppStore();
    const [btnInvest, setBtnInvest] = useState<string>(ENUM_INVEST_STATUS.INVEST_NOW);
    const isFocused = useIsFocused();
    const styles = MyStylesHome();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [banners, setBanners] = useState<BannerModel[]>([]);
    const [dataArr, setDataArr] = useState<PackageInvest[]>();
    const [dataDash, setDataDash] = useState<DashBroad>();
    const [showFloating, setShowFloating] = useState<boolean>(true);
    const refPromotionPopup = useRef<PopupActions>(null);
    const [promotions, setPromotion] = useState<PromotionsModel>();
    const [unMore, setUnMore] = useState<boolean>(false);
    const ref = useRef(null);
    const refPopup = useRef<PopupAlertActions>(null);

    const condition = useRef({
        isLoading: true,
        offset: 0,
        canLoadMore: true
    });

    useLayoutEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                StatusBar.setBarStyle(isFocused ? TYPE_FORMAT_HEADER_BAR.LIGHT_CONTENT : TYPE_FORMAT_HEADER_BAR.DARK_CONTENT, true);
            }, 500);
        }

    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            condition.current.offset = 0;
            fetchDataInvest();
            if (SessionManager.accessToken) {
                getUserInfo();
            }
            auth();
        }
    }, [isFocused]);

    const showPopupVimo = useCallback(() => {
        refPopup?.current?.showAlert?.(Languages.maintain.vimo, Languages.maintain.vimoDes);
    }, []);

    const auth = useCallback(() => {
        if (fastAuthInfoManager.isEnableFastAuth && fastAuthInfoManager?.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {

            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    fastAuthInfoManager.setEnableFastAuthentication(false);
                })
                .catch(() => { });
        }
    }, [fastAuthInfoManager]);

    useEffect(() => {
        if (isFocused) {
            if (userManager.userInfo) {
                fetchContractsDash();
            }
            if (!promotions) {
                fetchDataBanner();
            }
        }
    }, [isFocused, userManager.userInfo]);

    const getUserInfo = useCallback(async () => {
        const resInfoAcc = await apiServices.auth.getUserInfo();
        if (resInfoAcc.success) {
            const data = resInfoAcc?.data as UserInfoModal;
            userManager.updateUserInfo({
                ...data
            });
            if (userManager.userInfo?.tra_lai?.type_interest_receiving_account === TYPE_INTEREST_RECEIVE_ACC.VIMO) {
                showPopupVimo();
            }
        }
    }, [apiServices.auth, userManager]);

    const onOpenVPS = useCallback(() => {
        Utils.openURL(LINKS.VPS);
    }, []);

    const onOpenLuckyLott = useCallback(() => {
        Utils.openURL(STORE_LUCKY_LOTT);
    }, []);

    const fetchDataInvest = useCallback(async (isLoadMore?: boolean) => {
        if (!isLoadMore) {
            setIsLoading(true);
        }
        condition.current.isLoading = true;
        const resInvest = await apiServices.common.getListInvest(PAGE_SIZE, condition.current.offset);
        setIsLoading(false);
        if (resInvest.success) {
            const data = resInvest?.data as PackageInvest[];
            const dataSize = data.length;
            if (dataSize > 0) {
                if (isLoadMore) {
                    setDataArr((list) => [...list || [], ...data]);
                }
                else {
                    setDataArr(data);
                }
                condition.current.offset += dataSize;
            }
            condition.current.canLoadMore = dataSize >= PAGE_SIZE;
            setUnMore(dataSize >= PAGE_SIZE);
        }
        condition.current.isLoading = false;
        setIsLoading(false);

    }, [apiServices.common]);

    const fetchContractsDash = useCallback(async () => {
        setIsLoading(true);
        const resContractsDash = await apiServices.common.getContractsDash();
        setIsLoading(false);
        if (resContractsDash.success) {
            const data = resContractsDash?.data as DashBroad;
            setDataDash(data);
        }
    }, [apiServices.common]);

    const fetchDataBanner = useCallback(async () => {
        setIsLoading(true);
        const resBanner = await apiServices.common.getBanners();
        if (resBanner.success) {
            const data = resBanner?.data as BannerModel[];
            setBanners(data.filter(item => !item.title_vi.includes('CƠ HỘI')));
        }
        const resBannerHome = await apiServices.common.getBannerHome();
        if (resBannerHome.success) {
            const bannerHome = resBannerHome?.data as PromotionsModel;
            setPromotion(bannerHome);
            if (bannerHome && bannerHome.promotion && bannerHome.promotion?.length > 0) {
                setTimeout(() => {
                    setShowFloating(true);
                    showPromotionPopup();
                }, 500);
            }
        }
        setIsLoading(false);

    }, [apiServices.common]);

    const onMore = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchDataInvest(true);
        }
    }, [fetchDataInvest]);

    const navigateToDetail = useCallback((item: PackageInvest) => {
        if (userManager?.userInfo && !fastAuthInfoManager?.isEnableFastAuth) {
            Navigator.navigateToDeepScreen([TabsName.homeTabs], ScreenName.detailInvestment, { status: btnInvest, id: item?.id });
        } else {
            Navigator.navigateToDeepScreen([ScreenName.authStack], ScreenName.auth, { titleAuth: Languages.auth.txtLogin });
        }
    }, [userManager?.userInfo, fastAuthInfoManager?.isEnableFastAuth, btnInvest]);

    const navigateToInvestNow = useCallback((item: PackageInvest) => {
        if (userManager?.userInfo && !fastAuthInfoManager?.isEnableFastAuth) {
            Navigator.navigateToDeepScreen([TabsName.homeTabs], ScreenName.invest, { status: btnInvest, id: item?.id });
        } else {
            Navigator.navigateToDeepScreen([ScreenName.authStack], ScreenName.auth, { titleAuth: Languages.auth.txtLogin });
        }
    }, [btnInvest, fastAuthInfoManager?.isEnableFastAuth, userManager?.userInfo]);

    const gotoLogin = useCallback((titleAuth: string) => {
        setTimeout(() => {
            Navigator.navigateToDeepScreen([ScreenName.authStack], ScreenName.auth, { titleAuth });
        }, 1000);
    }, []);

    const renderNavigateScreen = useCallback((title: string) => {
        const onPress = () => gotoLogin(title);
        return (
            <Touchable style={styles.tobAuth} onPress={onPress}>
                <Text style={styles.txtLogin}>{title}</Text>
            </Touchable>
        );
    }, [gotoLogin, styles.tobAuth, styles.txtLogin]);

    const onNotifyInvest = useCallback(() => {
        Navigator.navigateScreen(ScreenName.notifyInvest);
    }, []);

    const gotoProfile = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenName.tabs], TabsName.accountTabs);
    }, []);

    const gotoReceivedBank = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenName.tabs, TabsName.accountTabs], ScreenName.accountBank);
    }, []);

    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const renderNewsItem = useCallback(({ item }: { item: BannerModel }) => {
        const navigate = () => {
            Navigator.pushScreen(ScreenName.myWedView, {
                title: item.title_vi,
                url: `${LINK_TIENNGAY.LINK_TIENNGAY_WEB}${item.link.toString()}`
            });
        };

        return (
            <Touchable style={styles.newsItem} onPress={navigate}>
                <MyImageView
                    imageUrl={item.image}
                    resizeMode={TYPE_RESIZE.COVER}
                    style={styles.communicationImage}
                />
                <Text style={styles.txtCommunityTitle} numberOfLines={2}>{item.title_vi}</Text>
                <Text style={styles.txtCommunityDes}>{DateUtils.getLongFromDate(item.created_at)}</Text>
            </Touchable>
        );
    }, [styles.communicationImage, styles.newsItem, styles.txtCommunityDes, styles.txtCommunityTitle]);

    const keyExtractorBanner = useCallback((item: BaseModel) => `${item._id?.$oid}`, []);

    const renderNews = useMemo(() => (
        <FlatList
            data={banners}
            style={styles.newsContainer}
            renderItem={renderNewsItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractorBanner}
        />
    ), [banners, keyExtractorBanner, renderNewsItem, styles.newsContainer]);

    const renderInvestHeaderItem = useCallback((title: string, money: number, styleMoney?: any, styleVnd?: any) => (
        <View style={styles.wrapTotalInterest}>
            <Text style={styles.txtSumProfit}>{title}</Text>
            <View style={styles.viewSumInvestValue}>
                <Text style={[styles.txtTotalInterestExtant, styleMoney]} numberOfLines={1}>{Utils.formatMoney(money)}</Text>
                <Text style={[styles.txtVNDSmall, styleVnd]} >{Languages.home.vnd}</Text>
            </View>
        </View>
    ), [styles.txtSumProfit, styles.txtTotalInterestExtant, styles.txtVNDSmall, styles.viewSumInvestValue, styles.wrapTotalInterest]);

    const renderTop = useMemo(() => (
        <View style={styles.viewForeground}>
            {(userManager?.userInfo && !fastAuthInfoManager.isEnableFastAuth) ?
                <View style={styles.headerContainer}>
                    <View style={styles.topInvestorContainer}>
                        <Touchable onPress={gotoProfile} style={styles.circleWrap}>
                            {!userManager.userInfo?.avatar_user ?
                                <AvatarIC width={SCREEN_WIDTH * 0.08} height={SCREEN_WIDTH * 0.08} />
                                :
                                <FastImage
                                    style={styles.fastImage}
                                    source={{
                                        uri: userManager.userInfo?.avatar_user
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            }
                        </Touchable>
                        <View style={styles.allInvestContainer}>
                            <Text style={styles.txtSumInvest}>{Languages.home.sumInvest}</Text>
                            <View style={styles.viewSumInvestValueCenter}>
                                <Text style={styles.txtSumInvestValue}>{Utils.formatMoney(dataDash?.tong_tien_dau_tu)}</Text>
                                <Text style={styles.txtVND}>{Languages.home.vnd}</Text>
                            </View>
                        </View>
                        <Touchable onPress={onNotifyInvest}>
                            <IcNotify style={styles.imgNotify} width={SCREEN_WIDTH * 0.08} />
                        </Touchable>
                    </View>
                    <View style={styles.viewTop}>
                        <View style={styles.wrapRow}>
                            {common.appConfig?.vimo_link
                                ? renderInvestHeaderItem(Languages.home.balanceVimo, dataDash?.so_du || 0)
                                : renderInvestHeaderItem(Languages.home.rootReceived, dataDash?.tong_goc_da_tra || 0)}
                            {renderInvestHeaderItem(Languages.home.sumpProfit, dataDash?.tong_tien_lai || 0)}
                        </View>
                        <View style={styles.wrapRow}>
                            {renderInvestHeaderItem(Languages.home.totalCaption, dataDash?.tong_goc_con_lai || 0, styles.txtTotalRemainingOrigin, styles.txtVNDRemainingOrigin)}
                            {renderInvestHeaderItem(Languages.home.sumResidualProfit, dataDash?.tong_lai_con_lai || 0)}
                        </View>
                    </View>
                </View>
                :
                <View style={styles.topScreenUnAuthn}>
                    <LogoHome style={styles.logoTienNgay} />
                    <Text style={styles.txtHello}>{Languages.home.hello}</Text>
                    <Text style={styles.txtName}>{Languages.home.nameApp}</Text>
                    <Text style={styles.txtInvest}>{Languages.home.investAndAccumulate}</Text>
                </View>
            }
            {(!userManager?.userInfo || fastAuthInfoManager.isEnableFastAuth) &&
                <View style={isIOS ? styles.viewSmallMenuLoginIOS : styles.viewSmallMenuLoginAndroid}>
                    {renderNavigateScreen(Languages.auth.txtLogin)}
                    {renderNavigateScreen(Languages.auth.txtSignUp)}
                </View>
            }
        </View>
    ), [styles.viewForeground, styles.headerContainer, styles.topInvestorContainer, styles.circleWrap, styles.fastImage, styles.allInvestContainer, styles.txtSumInvest, styles.viewSumInvestValueCenter, styles.txtSumInvestValue, styles.txtVND, styles.imgNotify, styles.viewTop, styles.wrapRow, styles.txtTotalRemainingOrigin, styles.txtVNDRemainingOrigin, styles.topScreenUnAuthn, styles.logoTienNgay, styles.txtHello, styles.txtName, styles.txtInvest, styles.viewSmallMenuLoginIOS, styles.viewSmallMenuLoginAndroid, userManager.userInfo, fastAuthInfoManager.isEnableFastAuth, gotoProfile, dataDash?.tong_tien_dau_tu, dataDash?.so_du, dataDash?.tong_tien_lai, dataDash?.tong_goc_con_lai, dataDash?.tong_lai_con_lai, onNotifyInvest, renderInvestHeaderItem, renderNavigateScreen, common.appConfig]);

    const renderUtility = useCallback((_onPress: () => any, _logo: any, _title: string, _describe: string) => (
        <Touchable style={styles.utilityWrap} onPress={_onPress}>
            {_logo}
            <View style={styles.txtUtility}>
                <Text style={styles.txtTitleUtility}>{_title}</Text>
                <Text style={styles.txtDescribeUtility}>{_describe}</Text>
            </View>
        </Touchable>
    ), [styles.txtDescribeUtility, styles.txtTitleUtility, styles.txtUtility, styles.utilityWrap]);

    const renderFooter = useMemo(() => (
        <>
            <View style={styles.marginHorizontal}>
                {dataArr && unMore && <Touchable style={styles.more} onPress={onMore}>
                    <Text style={[styles.txtForEachTitleQuestion, { color: COLORS.GREEN }]}>{Languages.home.more}</Text>
                </Touchable>}
                {renderUtility(onOpenLuckyLott, <LogoLuckyLott />, Languages.home.titleLuckyLott, Languages.home.describeLuckyLott)}
                {renderUtility(onOpenVPS, <LogoVfs />, Languages.home.stockVfs, Languages.home.signFree)}
                <Text style={styles.txtNews}>{Languages.home.newMedia}</Text>
            </View>
            {renderNews}
        </>
    ), [styles.marginHorizontal, styles.more, styles.txtForEachTitleQuestion, styles.txtNews, dataArr, unMore, onMore, renderUtility, onOpenLuckyLott, onOpenVPS, renderNews]);

    const renderItem = useCallback((item: any) => {
        const onPressToInvestNow = () => navigateToInvestNow(item);
        const onPressToDetail = () => navigateToDetail(item);
        return (
            <View style={styles.marginHorizontal}>
                <ItemInvest
                    onPress={onPressToDetail}
                    onPressInvestNow={onPressToInvestNow}
                    data={item}
                    title={ENUM_INVEST_STATUS.INVEST_NOW}
                />
            </View>
        );
    }, [navigateToDetail, navigateToInvestNow, styles.marginHorizontal]);

    const renderItemInvestPackage = useCallback((item: any) => renderItem(item?.item), [renderItem]);

    const focusContracts = useCallback(() => {
        // if (userManager?.userInfo && !fastAuthInfoManager.isEnableFastAuth) {
        //     Navigator.navigateToDeepScreen([TabsName.investTabs], ScreenName.investment, { types: ENUM_INVEST_STATUS.INVEST_NOW });
        // } else {
        //     Navigator.navigateToDeepScreen([ScreenName.authStack], ScreenName.auth, { titleAuth: Languages.auth.txtLogin });
        // }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager?.userInfo]);

    const renderReasonItems = useCallback((describe: string, hasDash?: boolean) => (
        <>
            <Text style={styles.txtReason}>{describe}</Text>
            {!hasDash && <Dash dashThickness={1} dashLength={10} dashGap={5} dashColor={COLORS.GRAY_13} />}
        </>
    ), [styles.txtReason]);

    const renderBottom = useMemo(() => (
        <View style={styles.viewBottom}>
            <Text style={styles.txtCenter}>{Languages.home.reasonInvest}</Text>
            <View style={styles.viewReason}>
                {renderReasonItems(Languages.home.reasonOne)}
                {renderReasonItems(Languages.home.reasonTwo)}
                {renderReasonItems(Languages.home.reasonThree)}
                {renderReasonItems(Languages.home.reasonFour)}
                {renderReasonItems(Languages.home.reasonFive, true)}
            </View>
        </View>
    ), [renderReasonItems, styles.txtCenter, styles.viewBottom, styles.viewReason]);

    const renderContent = useMemo(() => (
        <View style={!userManager?.userInfo || fastAuthInfoManager.isEnableFastAuth ? [{ marginTop: -3 }] : [{ marginTop: - SCREEN_HEIGHT * 0.02 }]}>
            <Text style={styles.txtCenter}>{Languages.home.investPackages}</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                ref={ref}
                data={dataArr}
                renderItem={renderItemInvestPackage}
                ListFooterComponent={renderFooter}
                keyExtractor={keyExtractor}
                nestedScrollEnabled
            />
            {renderBottom}
        </View>
    ), [dataArr, fastAuthInfoManager.isEnableFastAuth, keyExtractor, renderBottom, renderFooter, renderItemInvestPackage, styles.txtCenter, userManager?.userInfo]);

    const renderStatusBar = useMemo(() => (
        <StatusBar
            animated
            translucent
            backgroundColor={COLORS.TRANSPARENT}
            barStyle={TYPE_FORMAT_HEADER_BAR.LIGHT_CONTENT}
        />
    ), []);

    const renderBackground = useMemo(() => (
        <>
            {renderStatusBar}
            < ImageBackground source={Images.bg_header_home} style={styles.imageBg} resizeMode={TYPE_RESIZE.STRETCH} />
        </>
    ), [renderStatusBar, styles.imageBg]);

    const renderForeground = () => (renderTop);

    const showPromotionPopup = () => {
        refPromotionPopup.current?.show();
    };

    const onRefreshControlParallax = useCallback(() => {
        condition.current.offset = 0;
        fetchDataInvest();
        auth();

        if (userManager.userInfo) {
            fetchContractsDash();
        }
        if (SessionManager.accessToken) {
            getUserInfo();
        }
    }, [auth, fetchContractsDash, fetchDataInvest, getUserInfo, userManager.userInfo]);

    return (
        <NotificationListening>
            <View style={styles.container}>
                {renderStatusBar}
                <ParallaxScrollView
                    contentBackgroundColor={COLORS.TRANSPARENT}
                    backgroundColor={COLORS.TRANSPARENT}
                    parallaxHeaderHeight={SCREEN_HEIGHT * 0.3}
                    stickyHeaderHeight={SCREEN_HEIGHT * 0.12}
                    renderBackground={() => renderBackground}
                    renderForeground={renderForeground}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={onRefreshControlParallax}
                            tintColor={COLORS.WHITE}
                            colors={[COLORS.RED, COLORS.GREEN, COLORS.GRAY_1]}
                        />
                    }
                >
                    {renderContent}
                </ParallaxScrollView>
                {(showFloating && promotions?.icon && promotions?.promotion) ?
                    <DraggableComponent
                        image={promotions?.icon}
                        x={SCREEN_WIDTH - 110}
                        renderSize={100}
                        isCircle
                        shouldReverse
                        onShortPressRelease={showPromotionPopup}
                        onClose={() => setShowFloating(false)}
                    />
                    : <View></View>}
                {promotions?.promotion && <PopupPromotion
                    ref={refPromotionPopup}
                    data={promotions?.promotion}
                    onConfirm={focusContracts}
                />}
                <PopupVimo
                    ref={refPopup}
                    onConfirm={gotoReceivedBank}
                />
                {isLoading && <Loading isOverview />}
            </View >
        </NotificationListening >
    );
});

export default Home;
