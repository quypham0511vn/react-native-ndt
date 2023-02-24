import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import MonthPicker, { EventTypes } from 'react-native-month-year-picker';

import Languages from '@/common/Languages';
import HeaderBar from '@/components/header';
import { COLORS, HtmlStyles } from '@/theme';
import { MyStylesReferral } from './styles';
import { Touchable } from '@/components/elements/touchable';
import IcBtnFilter from '@/assets/image/ic_button_filter.svg';
import DateUtils from '@/utils/DateUtils';
import { useAppStore } from '@/hooks';
import { CommissionModel, Detail } from '@/models/comission-model';
import Loading from '@/components/loading';
import { ACTION_DATE_SET, ACTION_DISMISSED } from '@/libs/react-native-month-year-picker/src';
import NoData from '@/components/NoData';
import IMGNoData from '@/assets/image/img_no_data_invest.svg';

const ReferralUsers = observer(() => {
    const styles = MyStylesReferral();
    const { apiServices, common } = useAppStore();

    const [date, setDate] = useState(new Date());
    const [visibleFilter, setVisibleFilter] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(Languages.referralUsers.tableDes);
    const [filterDate, setFilterDate] = useState<string>();
    const [commission, setCommission] = useState<CommissionModel>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const showPicker = useCallback((value: boolean) => setVisibleFilter(value), []);

    const fetchData = useCallback(async () => {
        const my = filterDate?.split('/');
        if (my?.length === 2) {
            setLoading(true);
            const res = await apiServices.auth.getCommissionInfo(my[0], my[1]);
            setLoading(false);
            if (res.success && res.data) {
                setCommission(res.data as CommissionModel);
            }
        }
    }, [apiServices.auth, filterDate]);

    useEffect(() => {
        onValueChange('dateSetAction', date);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [filterDate]);

    const renderColIndexTotal = useCallback(() => <View style={[styles.colContainer, { backgroundColor: COLORS.LIGHT_GREEN }]}>
        <Text style={styles.colNameTotal}>
            {Languages.referralUsers.colMoney0}
        </Text>
        <Text style={styles.colMoneyTotal}>
            {Languages.referralUsers.colName0}
        </Text>
        <Text style={styles.colCommissionTotal}>
            {Languages.referralUsers.colCommission0}
        </Text>
    </View>, [styles.colCommissionTotal, styles.colContainer, styles.colMoneyTotal, styles.colNameTotal]);

    const renderColIndex = useCallback(() => <View style={[styles.colContainer, { backgroundColor: COLORS.LIGHT_GREEN }]}>
        <Text style={styles.colName}>
            {Languages.referralUsers.colName}
        </Text>
        <Text style={styles.colMoney}>
            {Languages.referralUsers.colMoney}
        </Text>
        <Text style={styles.colCommission}>
            {Languages.referralUsers.colCommission}
        </Text>
    </View>, [styles.colCommission, styles.colContainer, styles.colMoney, styles.colName]);

    const renderTotalRow = useCallback(() => <View style={styles.colContainerTotal}>
        <Text style={styles.colNameCTotal}>
            {`${commission?.total.commission}%`}
        </Text>
        <Text style={styles.colMoneyCTotal}>
            {commission?.total.total_money}
        </Text>
        <Text style={styles.colCommissionCTotal}>
            {commission?.total.money_commission}
        </Text>
    </View>, [commission?.total.commission, commission?.total.money_commission, commission?.total.total_money, styles.colCommissionCTotal, styles.colContainerTotal, styles.colMoneyCTotal, styles.colNameCTotal]);

    const renderRow = useCallback((item: Detail, index: number) => <View style={[styles.colContainer, { backgroundColor: index % 2 === 0 ? COLORS.GRAY_2 : COLORS.GRAY_15 }]}
        key={index}>
        <Text style={styles.colNameC}>
            {item.name}
        </Text>
        <Text style={styles.colMoneyC}>
            {item.total_money}
        </Text>
        <Text style={styles.colCommissionC}>
            {item.money_commission}
        </Text>
    </View>, [styles.colCommissionC, styles.colContainer, styles.colMoneyC, styles.colNameC]);

    const onPopupFilter = useCallback(() => {
        showPicker(true);
    }, [showPicker]);

    const onValueChange = useCallback((event: EventTypes, newDate: Date) => {
        const onSuccess = () => {
            const selectedDate = newDate || date;
            const monthYear = DateUtils.formatMonthPicker(newDate);
            showPicker(false);
            setDate(selectedDate);
            setFilterDate(monthYear);
            setTitle(Languages.referralUsers.tableDes.replace('%s', monthYear));
        };

        const onCancel = () => {
            showPicker(false);
        };

        switch (event) {
            case ACTION_DATE_SET:
                onSuccess();
                break;
            case ACTION_DISMISSED:
            default:
                onCancel();
        }

    }, [date, showPicker]);

    return (
        <View style={styles.container}>
            <HeaderBar isLight={false} title={Languages.referralUsers.title} hasBack />
            <View style={styles.wrapAllContent}>
                <View style={styles.desContainer}>
                    <Text style={styles.textDes}>
                        {title}
                    </Text>
                    <Touchable
                        style={styles.iconFilter}
                        onPress={onPopupFilter}
                    >
                        <IcBtnFilter />
                    </Touchable>
                </View>

                <ScrollView>
                    {(commission?.detail.length || 0) > 0 ? <>
                        {renderColIndexTotal()}
                        {renderTotalRow()}
                        {renderColIndex()}
                        {commission?.detail.map((item, index) => renderRow(item, index))}
                    </> : (!isLoading && filterDate && <View style={styles.wrapNoData}>
                        <NoData img={<IMGNoData />}
                            description={Languages.referralUsers.noCommission.replace('%s', filterDate)} />
                    </View>)}
                </ScrollView>
            </View>

            <View style={styles.note}>
                <HTMLView
                    value={Languages.referralUsers.des.replace('%str', `${common.appConfig?.date_commission}`)}
                    stylesheet={HtmlStyles || undefined}
                />
            </View>

            {visibleFilter && <MonthPicker
                locale="vi"
                value={date}
                minimumDate={new Date(2021, 1)}
                maximumDate={new Date()}
                okButton={Languages.common.agree}
                cancelButton={Languages.common.cancel}
                onChange={onValueChange}
            />}
            {isLoading && <Loading isOverview />}
        </View >
    );
});

export default ReferralUsers;
