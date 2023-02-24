import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';

import Languages from '@/common/Languages';
import Filter from '@/components/Filter';
import HeaderBar from '@/components/header';
import { useAppStore } from '@/hooks';
import { KeyValueModel } from '@/models/keyValue-model';
import { ItemCategory } from './item-category';
import { MyStylesNotifyInvest } from './styles';

export const NotifyInvest = () => {
    const styles = MyStylesNotifyInvest();
    const [categories, setCategories] = useState<KeyValueModel[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<KeyValueModel>();
    const pageViewRef = useRef();

    const { apiServices } = useAppStore();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = useCallback(async () => {
        const resCate = await apiServices.notification.getNotificationCategories();

        if (resCate.success && resCate.data) {
            setCategories(Object.keys(resCate.data).map((key, index) => {
                const cate = {
                    id: key,
                    label: resCate.data[key],
                    value: index
                };
                if(index === 0){
                    setSelectedFilter(cate);
                }
                return cate;
            }));
        }
    }, []);

    const renderCategories = useCallback(
        (item: KeyValueModel) => {
            const _onPress = () => {
                setSelectedFilter(item);
                pageViewRef?.current?.setPage?.(item.value);
            };

            return (
                <Filter
                    key={item.id}
                    style={styles.filterItem}
                    item={item}
                    onPress={_onPress}
                    selected={item.id == selectedFilter?.id}
                    disabled={item.id == selectedFilter?.id}
                />
            );
        }, [selectedFilter?.id]
    );

    const renderFilter = useMemo(() => (
        <View style={styles.topBarContainer}>
            {categories.map(renderCategories)}
        </View>
    ), [categories, selectedFilter]);

    const renderContent = useMemo(() => (
        <PagerView style={styles.pagerView} initialPage={0}
            scrollEnabled={false}
            ref={pageViewRef}>
            {categories.map(item => <ItemCategory key={item.id} category={item} />)}
        </PagerView>
    ), [categories]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.invest.notify} hasBack />
            {categories && renderFilter}
            {categories && renderContent}
        </View>
    );
};
