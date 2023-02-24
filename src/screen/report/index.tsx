import { BottomSheetModal, SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryTheme, VictoryZoomContainer } from 'victory-native';
import { useIsFocused } from '@react-navigation/native';

import ICUnderArrow from '@/assets/image/ic_under_arrow.svg';
import Languages from '@/common/Languages';
import HeaderBar from '@/components/header';
import KeyValueReport from '@/components/KeyValueReport';
import Loading from '@/components/loading';
import PickerBottomSheet from '@/components/PickerBottomSheet';
import { useAppStore } from '@/hooks';
import { ItemProps } from '@/models/common-model';
import { OverviewMonthOfQuarterModal, TotalOfQuarterModal } from '@/models/monthOfQuarter-model';
import DateUtils from '@/utils/DateUtils';
import Utils from '@/utils/Utils';
import { MyStylesReport } from './styles';

const Report = observer(() => {
    const styles = MyStylesReport();
    const { apiServices } = useAppStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [quarter, setQuarter] = useState<string>(DateUtils.getCurrentQuarter().toString());
    const [quarterList, setQuarterList] = useState<ItemProps[]>([]);
    const [year, setYear] = useState<string>(DateUtils.getCurrentYear().toString());
    const [yearList, setYearList] = useState<ItemProps[]>([]);
    const [dataChart, setDataChart] = useState<OverviewMonthOfQuarterModal[]>([]);
    const quarterRef = useRef<BottomSheetModal>(null);
    const yearRef = useRef<BottomSheetModal>(null);
    const [total, setTotal] = useState<TotalOfQuarterModal>();
    const isFocused = useIsFocused();
    const [reportList, setReportList] = useState<OverviewMonthOfQuarterModal[]>();

    const keyExtractor = useCallback((item?: OverviewMonthOfQuarterModal, index?: any) => `${item?.month}${index}`, []);

    useEffect(() => {
        if (isFocused) {
            setQuarter(DateUtils.getCurrentQuarter().toString());
            setYear(DateUtils.getCurrentYear().toString());
            fetchDataSearch();
        }
    }, [isFocused]);

    useEffect(() => {
        if (year && quarter && isFocused) {
            fetchReport();
        }
    }, [quarter, year, isFocused]);

    const fetchDataSearch = useCallback(async () => {
        const resQuarters = await apiServices.report.getQuarters();
        const resYear = await apiServices.report.getYear();
        if (resQuarters.success) {
            const dataQuarter = Utils.formatObjectToKeyLabel(resQuarters.data);
            setQuarterList(dataQuarter);
        }
        if (resYear.success) {
            const dataYear = Utils.formatObjectToKeyLabel(resYear.data);
            setYearList(dataYear.sort((a, b) => parseInt(b.value, 10) - parseInt(a.value, 10)));
        }

    }, [apiServices.report]);

    const fetchReport = useCallback(async () => {
        setIsLoading(true);
        const res = await apiServices.report.requestFinanceReport(quarter.substring(4), year);
        if (res.success) {
            setIsLoading(false);
            const dataMonths = res?.data as OverviewMonthOfQuarterModal[];

            setReportList(dataMonths);
            const dataTotal = res?.total as TotalOfQuarterModal;
            setTotal(dataTotal);

            const temp = dataMonths.map((item) => ({
                month: `T${`${item?.month}`.slice(6, 8).replace('/', '')}`,
                year: item?.year,
                so_hop_dong_dau_tu: item?.so_hop_dong_dau_tu,
                tong_tien_dau_tu: Math.round(Math.round(item?.tong_tien_dau_tu as number) / 10 ** 4) / 10 ** 2,
                tien_goc_thu_ve: item?.tien_goc_thu_ve,
                tong_lai_phi: item?.tong_lai_phi,
                tong_tien_thu_ve: Math.round(Math.round(item?.tong_tien_thu_ve as number) / 10 ** 4) / 10 ** 2
            })).reverse() as OverviewMonthOfQuarterModal[];
            setDataChart(temp);
        }
        setIsLoading(false);

    }, [apiServices.report, quarter, year]);

    const renderItem = useCallback(({ item, isOverview }:
        { isOverview?: boolean, item?: OverviewMonthOfQuarterModal }) => (
        <View style={!isOverview ? styles.containerItem : styles.containerItemOverview}>
            <Text style={isOverview ? styles.overviewQuarterTxt : styles.monthTxt}>
                {isOverview ? `${Languages.report.overview}${' '}${quarter}` || 0 :
                    `${item?.month}`.slice(0, 8).replace('/', '') || 0}
            </Text>
            <KeyValueReport
                styleTitle={styles.textLeftMonth}
                title={Languages.report.contractNumber}
                containerContent={styles.containerContentKeyValue}
                content={isOverview ? Utils.formatMoney(total?.tong_hop_dong || 0) : Utils.formatMoney(item?.so_hop_dong_dau_tu || 0)}
                styleColor={styles.txtContractNumber}
                defaultValue={0}
            />
            <KeyValueReport
                title={Languages.report.investMoney}
                styleTitle={styles.textLeftMonth}
                containerContent={styles.containerContentKeyValue}
                content={isOverview ? Utils.formatMoney(total?.tong_tat_ca_tien_dau_tu || 0) : Utils.formatMoney(item?.tong_tien_dau_tu || 0)}
                styleColor={styles.txtInvestNumber}
                defaultValue={0}
            />
            <KeyValueReport
                title={Languages.report.originMoneyCollected}
                styleTitle={styles.textLeftMonth}
                containerContent={styles.containerContentKeyValue}
                content={isOverview ? Utils.formatMoney(total?.tien_goc_thu_ve || 0) : Utils.formatMoney(item?.tien_goc_thu_ve || 0)}
                styleColor={styles.txtEarning}
                defaultValue={0}
            />
            <KeyValueReport
                title={Languages.report.interest}
                styleTitle={styles.textLeftMonth}
                containerContent={styles.containerContentKeyValue}
                content={isOverview ? Utils.formatMoney(total?.tong_lai_phi || 0) : Utils.formatMoney(item?.tong_lai_phi || 0)}
                styleColor={styles.txtInterest}
                defaultValue={0}
            />
        </View>
    ), [quarter, styles.containerContentKeyValue, styles.containerItem, styles.containerItemOverview, styles.monthTxt, styles.overviewQuarterTxt, styles.textLeftMonth, styles.txtContractNumber, styles.txtEarning, styles.txtInterest, styles.txtInvestNumber, total?.tien_goc_thu_ve, total?.tong_hop_dong, total?.tong_lai_phi, total?.tong_tat_ca_tien_dau_tu]);

    const renderChart = useMemo(() => (
        <View style={styles.containerContent}>
            <Text style={styles.overviewQuarterTitle}>{Languages.report.quarterlyOverview}</Text>
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{Languages.report.financialChart}</Text>
                <VictoryChart
                    width={SCREEN_WIDTH - 30}
                    height={SCREEN_HEIGHT * 0.35}
                    horizontal
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 30, y: 5 }}
                    containerComponent={
                        <VictoryZoomContainer
                            allowZoom={true}
                            allowPan={true}
                            zoomDomain={{ y: [0, Math.round(Math.round(total?.tong_tat_ca_tien_dau_tu as number) / 10 ** 4) / 10 ** 2 || 15] }}
                        />
                    }
                >
                    <VictoryGroup
                        offset={-3}
                        domainPadding={{ y: [2, -2] }}
                        domain={{
                            y: [0
                                , Math.round(Math.round(total?.tong_tat_ca_tien_dau_tu as number) / 10 ** 4) / 10 ** 2 || 15]
                        }}
                        animate
                    >

                        <VictoryBar
                            data={dataChart}
                            x={'month'}
                            y={'tong_tien_dau_tu'}
                            alignment={'start'}
                            style={styles.chartInvest}
                        />

                        <VictoryBar
                            data={dataChart}
                            x={'month'}
                            y={'tong_tien_thu_ve'}
                            alignment={'end'}
                            style={styles.chartEarning}
                        />

                    </VictoryGroup>
                    <VictoryLabel x={30} y={25} style={styles.labelAxis}
                        text={Languages.report.month}
                    />
                    <VictoryLabel x={SCREEN_WIDTH - 70} y={SCREEN_HEIGHT * 0.35 - 40} style={styles.labelAxisSmall}
                        text={Languages.common.million}
                    />

                    <VictoryLabel x={SCREEN_WIDTH - 70} y={SCREEN_HEIGHT * 0.35 - 60} style={styles.labelAxis}
                        text={Languages.common.vnd}
                    />
                </VictoryChart>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <View style={styles.rectangleInvest}></View>
                        <Text style={styles.noteChart}>{Languages.report.investment}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.rectangleEarning}></View>
                        <Text style={styles.noteChart}>{Languages.report.moneyCollected}</Text>
                    </View>
                </View>
            </View>
            {renderItem({ isOverview: true })}
            <Text style={styles.overviewQuarterTitle}>{Languages.report.monthOfQuarter}</Text>
        </View>
    ), [dataChart, renderItem, styles.chartContainer, styles.chartEarning, styles.chartInvest, styles.chartTitle, styles.containerContent, styles.labelAxis, styles.labelAxisSmall, styles.noteChart, styles.overviewQuarterTitle, styles.rectangleEarning, styles.rectangleInvest, styles.row, total?.tong_tat_ca_tien_dau_tu]);

    const renderMonthList = useMemo(() => {

        const onRefresh = () => {
            setIsRefresh(true);
            fetchReport();
            setIsRefresh(false);
        };

        return (
            <FlatList
                data={reportList}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={renderChart}
                refreshControl={
                    <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
                }
                style={styles.flatList}
                showsVerticalScrollIndicator={false}
            />
        );
    }, [fetchReport, isRefresh, keyExtractor, renderChart, renderItem, reportList, styles.flatList]);

    const onPressQuarter = useCallback((item?: any) => {
        setQuarter(item?.value);
    }, []);
    const onPressYear = useCallback((item?: any) => {
        setYear(item?.value);
    }, []);
    const renderFilter = useMemo(() => (
        <View style={styles.rowFilter}>
            <PickerBottomSheet
                ref={quarterRef}
                data={quarterList}
                value={quarter}
                placeholder={Languages.report.quarter}
                onPressItem={onPressQuarter}
                btnContainer={styles.rowItemFilter}
                valueText={[styles.txtInterest, styles.txtQuarter]}
                rightIcon={<ICUnderArrow />}
                containerStyle={styles.containerItemFilter}
            />
            <PickerBottomSheet
                ref={yearRef}
                data={yearList}
                value={year}
                placeholder={Languages.report.year}
                onPressItem={onPressYear}
                btnContainer={styles.rowItemFilter}
                valueText={[styles.txtInterest, styles.txtQuarter]}
                rightIcon={<ICUnderArrow />}
                containerStyle={styles.containerItemFilter}
            />
        </View>
    ), [onPressQuarter, onPressYear, quarter, quarterList, styles.containerItemFilter, styles.rowFilter, styles.rowItemFilter, styles.txtInterest, styles.txtQuarter, year, yearList]);

    return (
        <View style={styles.container}>
            <HeaderBar title={`${Languages.report.title}`} isLight={false} />
            {renderFilter}
            {renderMonthList}
            {isLoading && <Loading isOverview />}
        </View >
    );
});

export default Report;
