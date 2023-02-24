import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Dash from 'react-native-dash';
import PushNotification from 'react-native-push-notification';

import IcNoDataNotify from '@/assets/image/home/ic_no_data_notify.svg';
import WarnIC from '@/assets/image/ic_warn_vimo_red_round.svg';
import { Configs, isIOS } from '@/common/Configs';
import { ENUM_INVEST_STATUS, TYPE_RESIZE } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabsName } from '@/common/screenNames';
import { Touchable } from '@/components/elements/touchable';
import { MyImageView } from '@/components/image';
import Loading from '@/components/loading';
import MyFlatList from '@/components/MyFlatList';
import NoData from '@/components/NoData';
import PopupNotifyNoAction from '@/components/PopupNotifyNoAction';
import { useAppStore } from '@/hooks';
import { Notify } from '@/models/invest';
import { KeyValueModel } from '@/models/keyValue-model';
import { NotificationTotalModel } from '@/models/notification';
import { PopupActionTypes } from '@/models/typesPopup';
import Navigator from '@/routers/Navigator';
import { COLORS, IconSize, RenderHtmlStyle } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import RenderHtml from 'react-native-render-html';
import { MyStylesNotifyInvest } from './styles';
import CheckPermission from '@/utils/CheckPermission';

const PAGE_SIZE = 20;

export const ItemCategory = ({ category }: { category: KeyValueModel }) => {
    const styles = MyStylesNotifyInvest();
    const [data, setData] = useState<Notify[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(true);

    const { apiServices } = useAppStore();
    const popupConfirm = useRef<PopupActionTypes>(null);

    const condition = useRef({
        isLoading: false,
        offset: 0,
        canLoadMore: true
    });

    useEffect(() => {
        fetchData();
    }, [category]);

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        if (condition.current.isLoading) {
            return;
        }

        const res = await apiServices.invest.getNotify(PAGE_SIZE, condition.current.offset, category.id);
        let totalSize = 0;
        if (res.success) {
            const dataNotify = res.data as Notify[];
            totalSize = dataNotify?.length || 0;

            if (totalSize > 0) {
                if (isLoadMore) {
                    setData((list) => [...list || [], ...dataNotify]);
                } else {
                    setData(dataNotify);
                }
                condition.current.offset += totalSize;
            } else if (!isLoadMore) {
                setData([]);
            }
        }

        setIsRefreshing(false);
        condition.current.isLoading = false;
        condition.current.canLoadMore = totalSize >= PAGE_SIZE;
        setCanLoadMoreUI(condition.current.canLoadMore);
    }, [apiServices.invest, category.id]);

    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const renderItem = useCallback(({ item }: { item: Notify }) => {
        const onRead = async (id: number, status: number) => {
            if (status == 1) {
                const res = await apiServices.invest.getNotifyUpdateRead(id);
                if (res.success) {
                    setData(last => last.map(it => {
                        if (item.id == it.id) {
                            it.status = 2;
                        }
                        return it;
                    }));
                    const resCountNotify = await apiServices.notification?.getUnreadNotify();
                    if (resCountNotify.success) {
                        const dataNotify = resCountNotify.data as NotificationTotalModel;
                        if (isIOS) { PushNotificationIOS.setApplicationIconBadgeNumber(dataNotify?.total_unRead); }
                        else PushNotification.setApplicationIconBadgeNumber(dataNotify?.total_unRead);
                    }
                    if (item.link) {
                        Navigator.navigateToDeepScreen([TabsName.homeTabs], ScreenName.detailInvestment, { status: ENUM_INVEST_STATUS.INVESTING, id: `${item?.action_id}` });
                    }
                }
            }
            if (item.link) {
                Navigator.navigateToDeepScreen([TabsName.homeTabs], ScreenName.detailInvestment, { status: ENUM_INVEST_STATUS.INVESTING, id: `${item?.action_id}` });
            }
        };

        const source = `<div style="font-family: '${Configs.FontFamily.regular}'; font-size: ${Configs.FontSize.size13}px; color: ${COLORS.BLACK}">
            ${item.message}
          </div>`

        const mainView = (isUnRead: boolean, isPromotion?: boolean) => {
            return <>
                {!isPromotion && <>
                    <View style={styles.columnTop}>
                        <View style={styles.rowTop}>
                            <Text style={[styles.title, styles.viewLeft,
                            { color: isUnRead ? COLORS.GREEN : COLORS.GRAY_18 }]}>
                                {item?.title}
                            </Text>
                            {isUnRead && <View style={styles.unReadTag} />}
                        </View>
                        <Text style={[styles.txtTimeDate]}>
                            {DateUtils.formatDatePicker(item.created_at)}
                        </Text>
                    </View>
                    <Dash
                        dashThickness={1}
                        dashLength={10}
                        dashGap={5}
                        dashColor={COLORS.GRAY_13}
                        style={{ marginBottom: 5 }}
                    />
                </>}
                {item.image && <MyImageView
                    imageUrl={item.image}
                    style={IconSize.sizeNotify}
                    resizeMode={TYPE_RESIZE.STRETCH}
                />}

                {isPromotion && <>
                    <Text style={styles.titlePromotion}>{item?.title}</Text>
                    <Text style={styles.txtTimeDatePromotion}>{DateUtils.formatDatePicker(item.created_at)}</Text>
                </>}

                <View style={{ paddingHorizontal: isPromotion ? 10 : 0, opacity: isUnRead ? 1 : 0.5 }}>
                    <RenderHtml
                        contentWidth={SCREEN_WIDTH}
                        source={{ html: source }}
                        systemFonts={[Configs.FontFamily.regular]}
                        tagsStyles={RenderHtmlStyle}
                    />
                </View>
            </>
        }

        if (category.value === 1) {
            return (
                <Touchable style={styles.item}
                    onPress={() => onRead(item?.id, item?.status)}>
                    {mainView(item?.status === 1)}
                </Touchable >
            );
        } else {
            return (
                <View style={styles.itemPromotion}>
                    {mainView(false, true)}
                </View >
            );
        }
    }, [apiServices.invest, styles.item, styles.itemBlur, styles.rowTop, styles.title, styles.txtNote, styles.txtRight, styles.txtTimeDate, styles.viewLeft]);

    const renderFooter = useMemo(() => <>
        {canLoadMoreUI && <Loading />}
    </>, [canLoadMoreUI]);

    const renderEmptyData = useMemo(() => (
        <View style={styles.wrapNoData}>
            {!canLoadMoreUI && <NoData img={<IcNoDataNotify />} description={Languages.home.noNotify} />}
        </View>
    ), [canLoadMoreUI, styles.wrapNoData]);

    const onRefreshing = useCallback(() => {
        condition.current.offset = 0;
        condition.current.canLoadMore = true;
        setIsRefreshing(true);
        fetchData();
    }, [fetchData]);

    const handleLoadMore = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchData(true);
        }
    }, [fetchData]);

    const showMarkReadPopup = useCallback(async () => {
        popupConfirm.current?.show();
    }, []);

    const onMarkReadAll = useCallback(async () => {
        popupConfirm.current?.hide();
        const res = await apiServices.notification.markReadAll();
        if (res.success) {
            onRefreshing();
        }
    }, []);

    const renderNotify = useMemo(() => (
        <MyFlatList
            contentContainerStyle={styles.flatList}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmptyData}
            ListFooterComponent={renderFooter}
            refreshing={isRefreshing}
            onRefresh={onRefreshing}
            onEndReached={handleLoadMore}
        />
    ), [data, styles.flatList, renderItem, keyExtractor, renderEmptyData, renderFooter, isRefreshing, onRefreshing, handleLoadMore]);

    return (
        <View style={styles.wrapContent}>
            {data && renderNotify}
            {category.value === 1 && <Touchable style={styles.readAll} onPress={showMarkReadPopup}>
                <Text style={styles.readAllText}>{Languages.notify.readAll}</Text>
            </Touchable>}

            <PopupNotifyNoAction
                ref={popupConfirm}
                renderIcon={<WarnIC />}
                containerAllBtn={styles.containerAllBtnPopup}
                containerAgreeBtn={styles.containerItemBtnPopup}
                containerCancelBtn={styles.containerCancelBtnPopup}
                renderContent={Languages.notify.readAllNotice}
                renderTitle={Languages.notify.readAll}
                textCancel={styles.textCancel}
                hasButton
                onConfirm={onMarkReadAll}
            />
        </View>
    );
};

