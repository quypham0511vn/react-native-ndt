import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Text, TextStyle, View, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

import IcBtnFilter from '@/assets/image/ic_button_filter.svg';
import IMGNoData from '@/assets/image/img_no_data_invest.svg';
import arrayIcon from '@/common/arrayIcon';
import { ENUM_INVESTED_TYPE, ENUM_INVEST_STATUS } from '@/common/constants';
import Languages from '@/common/Languages';
import ScreenName, { TabsName } from '@/common/screenNames';
import { ItemProps } from '@/components/bottomsheet';
import BottomSheetComponentInvest from '@/components/BottomSheetInvest';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import ItemInvest from '@/components/ItemInvest';
import Loading from '@/components/loading';
import MyFlatList from '@/components/MyFlatList';
import NoData from '@/components/NoData';
import PopupFilterInvested from '@/components/PopupFilterInvested';
import PopupInvest from '@/components/popupInvest';
import { useAppStore } from '@/hooks';
import { PackageInvest, PagingConditionTypes } from '@/models/invest';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';
import { HeaderBar } from '../../components/header';
import styles from './styles';

const PAGE_SIZE = 10;

const Investment = observer(({ route }: { route: any }) => {
    const isFocus = useIsFocused();
    const [btnInvest, setBtnInvest] = useState<string>(ENUM_INVEST_STATUS.INVEST_NOW);
    const [listStore, setListStore] = useState<PackageInvest[]>();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [dataTime, setDataTime] = useState<any>([]);
    const [timeValue, setTimeValue] = useState<ItemProps>();

    const [dataMoney, setDataMoney] = useState<any>([]);
    const [moneyValueInvest, setMoneyValueInvest] = useState<ItemProps>();
    const [moneyValueInvested, setMoneyValueInvested] = useState<ItemProps>();
    const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
    const [dataSuggestion, setDataSuggestion] = useState<any[]>();

    const popupInvestRef = useRef<any>();
    const popupInvestedRef = useRef<any>();
    const refBottomSheetMonth = useRef<any>(null);
    const refBottomSheetMoney = useRef<any>(null);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(true);
    const condition = useRef<PagingConditionTypes>({
        isLoading: true,
        offset: 1,
        canLoadMore: true,
        timeInvestment: '',
        moneyInvest: '',
        textSearch: '',
        fromDate: '',
        toDate: '',
        moneyInvested: '',
        option: ''
    });
    const [isReset, setIsReset] = useState<boolean>(false);

    const inputRef = useRef<TextFieldActions>(null);

    const { apiServices } = useAppStore();

    useEffect(() => {
        if (isFocus) {
            fetchData(btnInvest, false);
            fetchDataTimeInvestment();
            fetchDataMoney();
        }
    }, [isFocus]);

    useEffect(() => {
        setBtnInvest(ENUM_INVEST_STATUS.INVEST_NOW);
    }, []);

    const fetchDataInvested = useCallback(async (isLoadMore?: boolean) => {
        setCanLoadMoreUI(true);

        if (!isLoadMore) {
            setIsLoading(true);
        }
        condition.current.isLoading = true;
        const resInvest = await apiServices.invest.getListContractInvesting(
            condition.current.option,
            condition.current.textSearch,
            condition.current.moneyInvested,
            condition.current.fromDate,
            condition.current.toDate,
            isLoadMore ? condition.current.offset : 0,
            PAGE_SIZE
        );
        const newData = resInvest.data as PackageInvest[];
        const newSize = newData?.length;

        if (newSize > 0) {
            if (isLoadMore) {
                setListStore((data) => [...data || [], ...newData]);
            }
            else {
                setListStore(newData);
            }
            condition.current.offset = isLoadMore ? condition.current.offset + newSize : newSize;
        }
        else if (!resInvest?.success || !isLoadMore) {
            setListStore([]);
        }
        condition.current.isLoading = false;
        condition.current.canLoadMore = newSize >= PAGE_SIZE;
        setIsLoading(false);
        setCanLoadMoreUI(condition.current.canLoadMore);
    }, [apiServices.invest]);

    const fetchAllDataInvest = useCallback(async (isLoadMore?: boolean) => {
        setCanLoadMoreUI(true);

        if (!isLoadMore) {
            setIsLoading(true);
        }

        condition.current.isLoading = true;
        const resInvest = await apiServices.invest.getAllContractInvest(
            condition.current.textSearch,
            condition.current.timeInvestment,
            condition.current.moneyInvest,
            isLoadMore ? condition.current.offset : 0,
            PAGE_SIZE);
        const newData = resInvest.data as PackageInvest[];
        const newSize = newData?.length;

        if (newSize > 0) {
            if (isLoadMore) {
                setListStore((data) => [...data || [], ...newData]);
            }
            else {
                setListStore(newData);
            }
            condition.current.offset = isLoadMore ? condition.current.offset + newSize : newSize;
        }
        else if (!resInvest?.success || !isLoadMore) {
            setListStore([]);
        }

        condition.current.isLoading = false;
        condition.current.canLoadMore = newSize >= PAGE_SIZE;
        setIsLoading(false);
        setCanLoadMoreUI(condition.current.canLoadMore);
    }, [apiServices.invest]);

    const fetchData = useCallback((type: string, isLoadMore?: boolean) => {
        switch (type) {
            case ENUM_INVEST_STATUS.INVEST_NOW:
                fetchAllDataInvest(isLoadMore);
                break;
            default:
                fetchDataInvested(isLoadMore);
                break;
        }
    }, [fetchAllDataInvest, fetchDataInvested]);

    const onEndReached = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchData(btnInvest, true);
        }
    }, [btnInvest, fetchData]);

    const onRefresh = useCallback(() => {
        setIsReset(!isReset);
        setTimeValue({});
        setMoneyValueInvest({});
        condition.current.offset = 0;
        condition.current.timeInvestment = '';
        condition.current.moneyInvest = '';
        condition.current.textSearch = '';
        condition.current.fromDate = '';
        condition.current.toDate = '';
        condition.current.moneyInvested = '';
        setMoneyValueInvested({});
        inputRef.current?.setValue('');
        setIsRefreshing(true);
        fetchData(btnInvest);
        setIsRefreshing(false);
    }, [btnInvest, fetchData, isReset]);

    const fetchDataTimeInvestment = useCallback(async () => {
        const res = await apiServices.invest.getListTimeInvestment();
        if (res.success) {
            const data = res.data as [];
            const temp = Object.entries(data);
            setDataTime(temp.map((item) => ({
                id: item[0],
                value: item[1]

            })));
        }
    }, [apiServices.invest]);

    const fetchDataMoney = useCallback(async () => {
        const res = await apiServices.invest.getListMoneyInvestment();
        if (res.success) {
            const data = res.data as [];
            const temp = Object.entries(data);
            setDataMoney(temp.map((item) => ({
                id: item[0],
                value: item[1]

            })));
        }
    }, [apiServices.invest]);

    const navigateToDetail = useCallback((item: any) => {
        if (item) {
            Navigator.pushScreen(ScreenName.detailInvestment, { status: btnInvest, id: item?.id, screen: 'invest' });
        }
    }, [btnInvest]);

    const navigateToInvestNow = useCallback((item: any) => {
        Navigator.navigateToDeepScreen([TabsName.investTabs], ScreenName.invest, { status: btnInvest, id: item?.id, screen: 'invest' });
    }, [btnInvest]);

    const openBottomSheet = useCallback((type: string) => {
        if (type === Languages.invest.monthInvest)
            refBottomSheetMonth.current.show();
        if (type === Languages.invest.chooseMoney)
            refBottomSheetMoney.current.show();
    }, []);

    const onPressItem = useCallback((item?: any, title?: string) => {
        if (title === Languages.invest.monthInvest) {
            setTimeValue(item);
            condition.current.timeInvestment = item.id;
        }
        if (title === Languages.invest.chooseMoney) {
            if (btnInvest === ENUM_INVEST_STATUS.INVEST_NOW) {
                setMoneyValueInvest(item);
                condition.current.moneyInvest = item.id;
            }
            else {
                setMoneyValueInvested(item);
                condition.current.moneyInvested = item.id;
            }
        }

        if (btnInvest === ENUM_INVEST_STATUS.INVEST_NOW) {
            popupInvestRef.current?.show();
        }
        else {
            popupInvestedRef.current?.show();
        }
    }, [btnInvest]);

    const handleInputOnChange = useCallback(
        (value: string) => {
            const trimValue = value.trim();
            inputRef.current?.setValue(trimValue ? Utils.formatMoney(trimValue) : '');
            setShowSuggestion(true);
            setDataSuggestion(Utils.updateSuggestions(trimValue));
            if (Number(Utils.formatTextToNumber(trimValue)) >= 10e5) {
                condition.current.fromDate = '';
                condition.current.toDate = '';
                condition.current.textSearch = Number(Utils.formatTextToNumber(trimValue)).toString();
                switch (btnInvest) {
                    case ENUM_INVEST_STATUS.INVEST_NOW:
                        fetchAllDataInvest(false);
                        break;
                    default:
                        fetchDataInvested(false);
                        break;
                }
            }
        },
        [btnInvest, fetchAllDataInvest, fetchDataInvested]
    );
    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const renderItem = useCallback(({ item }: any) => {
        // console.log('item',item);
        const navigateScreen = () => {
            navigateToDetail(item);
        };
        const onPressToInvestNowScreen = () => {
            navigateToInvestNow(item);
        };
        switch (btnInvest) {
            case ENUM_INVEST_STATUS.INVEST_NOW:
                return <ItemInvest
                    onPress={navigateScreen}
                    onPressInvestNow={onPressToInvestNowScreen}
                    data={item}
                    title={ENUM_INVEST_STATUS.INVEST_NOW} />;
            case ENUM_INVEST_STATUS.INVESTING:
                return <ItemInvest
                    onPress={navigateScreen}
                    onPressInvestNow={onPressToInvestNowScreen}
                    data={item}
                    title={ENUM_INVEST_STATUS.INVESTING} />;
            case ENUM_INVEST_STATUS.HISTORY:
                return <ItemInvest
                    onPress={navigateScreen}
                    data={item}
                    title={ENUM_INVEST_STATUS.HISTORY} />;
            default:
                return null;
        }
    }, [btnInvest, navigateToDetail, navigateToInvestNow]);

    const renderInvest = useCallback((type: string) => {
        const styleBt = {
            backgroundColor: btnInvest === type ? COLORS.WHITE : null
        } as ViewStyle;

        const styleTxt = {
            color: btnInvest === type ? COLORS.GREEN : COLORS.GRAY_7
        } as TextStyle;

        const onPress = () => {
            setBtnInvest(type);
            setTimeValue(undefined);
            inputRef.current?.setValue('');
            condition.current.offset = 0;
            condition.current.fromDate = '';
            condition.current.toDate = '';
            condition.current.moneyInvest = '';
            condition.current.moneyInvested = '';
            condition.current.textSearch = '';
            condition.current.timeInvestment = '';
            if (type === ENUM_INVEST_STATUS.HISTORY) condition.current.option = ENUM_INVESTED_TYPE.INVESTED;
            if (type === ENUM_INVEST_STATUS.INVESTING) condition.current.option = ENUM_INVESTED_TYPE.INVESTING;
            popupInvestedRef.current.clear();
            setMoneyValueInvested({});
            setMoneyValueInvest({});
            setListStore([]);
            fetchData(type);

        };

        const getTitle = () => {
            switch (type) {
                case ENUM_INVEST_STATUS.INVEST_NOW:
                    return Languages.invest.attractInvest;
                case ENUM_INVEST_STATUS.INVESTING:
                    return Languages.invest.investing;
                case ENUM_INVEST_STATUS.HISTORY:
                    return Languages.invest.history;
                default:
                    return Languages.invest.attractInvest;
            }
        };

        return (
            <Touchable disabled={btnInvest === type} onPress={onPress} style={[styles.btInvest, styleBt]} radius={26}>
                <Text style={[styles.txtBtnStatus, styleTxt]}>{getTitle()}</Text>
            </Touchable>
        );
    }, [btnInvest, fetchData]);

    const onConfirmFilter = useCallback(() => {
        inputRef.current?.setValue('');
        condition.current.textSearch = '';
        fetchData(btnInvest);
    }, [btnInvest, fetchData]);

    const onConfirmFilterInvested = useCallback((fromDate: string, toDate: string) => {
        condition.current.fromDate = fromDate;
        condition.current.toDate = toDate;
        condition.current.moneyInvested = moneyValueInvested?.id || '';
        inputRef.current?.setValue('');
        condition.current.textSearch = '';
        fetchDataInvested(isLoading);
    }, [fetchDataInvested, isLoading, moneyValueInvested?.id]);

    const onPopupInvest = useCallback(() => {
        Keyboard.dismiss();
        switch (btnInvest) {
            case ENUM_INVEST_STATUS.INVEST_NOW:
                popupInvestRef.current.show();
                break;
            default:
                popupInvestedRef.current.show();
                break;
        }

    }, [btnInvest]);

    const onCancelPopupFilterInvested = useCallback(() => {
        condition.current.fromDate = '';
        condition.current.toDate = '';
        setMoneyValueInvested(undefined);
    }, []);

    const onCancelPopupFilter = useCallback(() => {
        condition.current.timeInvestment = '';
        condition.current.moneyInvest = '';
        setTimeValue(undefined);
        setMoneyValueInvest(undefined);
    }, []);

    const openTimeInvestment = useCallback(() => {
        refBottomSheetMoney.current.show();
    }, []);

    const onPressSuggestItem = useCallback((item: string) => {
        setShowSuggestion(false);
        inputRef.current?.setValue(item);
        condition.current.textSearch = item;
        condition.current.fromDate = '';
        condition.current.toDate = '';
        condition.current.moneyInvest = '';
        condition.current.moneyInvested = '';
        popupInvestedRef.current.clear();
        if (btnInvest === ENUM_INVEST_STATUS.INVEST_NOW) fetchAllDataInvest(isLoading);
        else fetchDataInvested(isLoading);
    }, [btnInvest, fetchAllDataInvest, fetchDataInvested, isLoading]);


    const renderSuggestionItem = useCallback(({ item }: any) => {
        const onPress = () => {
            onPressSuggestItem(item);
        };
        return <Touchable onPress={onPress} style={styles.itemSuggestion}>
            <Text style={styles.txtSuggest}>{Utils.formatMoney(item)}</Text>
        </Touchable>;
    }, [onPressSuggestItem]);

    const renderSearchBar = useMemo(() => (
        <>
            <View style={styles.wrapSearch}>
                <MyTextInput
                    onChangeText={handleInputOnChange}
                    rightIcon={arrayIcon.login.search}
                    containerInput={styles.input}
                    placeHolder={Languages.invest.enter}
                    keyboardType={'NUMBER'}
                    ref={inputRef}
                />
                <Touchable
                    style={styles.iconFilter}
                    onPress={onPopupInvest}
                >
                    <IcBtnFilter />
                </Touchable>

            </View>
            {showSuggestion && <View style={styles.suggestion}>
                <FlatList
                    renderItem={renderSuggestionItem}
                    data={dataSuggestion}
                />
            </View>}
        </>
    ), [dataSuggestion, handleInputOnChange, onPopupInvest, renderSuggestionItem, showSuggestion]);

    const renderLoading = useMemo(() => <View >{canLoadMoreUI && <Loading />}</View>, [canLoadMoreUI]);

    const renderEmptyData = useMemo(() => {
        if (listStore?.length === 0 && isLoading === false) {
            return (
                <View style={styles.wrapNodata}>
                    <NoData img={<IMGNoData />}
                        description={btnInvest === ENUM_INVEST_STATUS.INVESTING ? Languages.invest.emptyData2 : Languages.invest.emptyData1} />
                </View>
            );
        }
        return null;
    }, [btnInvest, isLoading, listStore?.length]);

    return (
        <View style={styles.main}>
            <HeaderBar title={Languages.invest.title} isLight={false} />
            <View style={styles.wrapContent}>
                <View style={styles.investTab}>
                    {renderInvest(ENUM_INVEST_STATUS.INVEST_NOW)}
                    {renderInvest(ENUM_INVEST_STATUS.INVESTING)}
                    {renderInvest(ENUM_INVEST_STATUS.HISTORY)}
                </View>
                {renderSearchBar}
                <MyFlatList
                    style={styles.flatList}
                    showsVerticalScrollIndicator={false}
                    data={listStore}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={renderLoading}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    onEndReached={onEndReached}
                    ListEmptyComponent={renderEmptyData}
                />
            </View>
            <PopupInvest
                ref={popupInvestRef}
                title={Languages.invest.packageInvest}
                onConfirm={onConfirmFilter}
                openBottomSheet={openBottomSheet}
                timeInvestment={timeValue}
                moneyInvestment={moneyValueInvest}
                onCancel={onCancelPopupFilter}
            />
            <PopupFilterInvested
                ref={popupInvestedRef}
                title={Languages.invest.packageInvest}
                onConfirm={onConfirmFilterInvested}
                openTimeInvestment={openTimeInvestment}
                money={moneyValueInvested?.value}
                onCancel={onCancelPopupFilterInvested}
                isRefresh={isReset}
            />
            <BottomSheetComponentInvest
                ref={refBottomSheetMoney}
                data={dataMoney}
                title={Languages.invest.chooseMoney}
                onPressItem={onPressItem}
            />
            <BottomSheetComponentInvest
                ref={refBottomSheetMonth}
                data={dataTime}
                title={Languages.invest.monthInvest}
                onPressItem={onPressItem}
            />
        </View>
    );
});

export default Investment;
