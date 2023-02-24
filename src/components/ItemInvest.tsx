import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Touchable } from './elements/touchable';
import Languages from '@/common/Languages';
import IcBtnInvest from '@/assets/image/ic_button_invest.svg';
import { Configs } from '@/common/Configs';
import Utils from '@/utils/Utils';
import { ENUM_INVEST_STATUS } from '@/common/constants';
import { PackageInvest } from '@/models/invest';

type ItemProps = {
    data?: PackageInvest;
    onPress?: () => void
    onPressInvestNow?: () => void
    hasButton?: boolean | true
    title?: string
};

const ItemInvest = ({ data, onPress, onPressInvestNow, hasButton, title }: ItemProps
) => {
    const styleText = {
        color: !hasButton ? COLORS.GREEN : COLORS.GRAY_7
    } as TextStyle;
    return (
        <View style={styles.item}>
            <Touchable onPress={onPress}>
                <View style={styles.rowTop}>
                    <Text style={[styles.txtMoney, styleText]}>{Utils.formatMoney(data?.so_tien_dau_tu)}</Text>
                    <View style={styles.wrapText}>
                        <Text style={styles.txtInterest}>{Languages.invest.interestYear}</Text>
                        <Text style={styles.txtPercent}>{data?.ti_le_lai_suat_hang_nam}</Text>
                    </View>
                </View>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_13} />

                <View style={styles.rowCenter}>
                    <View>
                        <Text style={styles.txtInterest}>{Languages.invest.time}</Text>
                        <Text style={styles.txtFormality}>{data?.thoi_gian_dau_tu}</Text>
                    </View>

                    {title === ENUM_INVEST_STATUS.HISTORY ?
                        <View style={styles.wrapText}>
                            <Text style={styles.txtInterest}>{Languages.invest.sumMoney}</Text>
                            <Text style={styles.greenText}>{Utils.formatMoney(data?.so_tien_dau_tu)}</Text>
                        </View> :
                        <View style={styles.wrapText}>
                            <Text style={styles.txtInterest}>{Languages.invest.intent}</Text>
                            <Text style={styles.greenText}>{Utils.formatMoney(data?.tong_lai_du_kien)}</Text>
                        </View>
                    }
                </View>

                {title === ENUM_INVEST_STATUS.INVESTING && <>
                    <Dash
                        dashThickness={1}
                        dashLength={10}
                        dashGap={5}
                        dashColor={COLORS.GRAY_13} />
                    <View style={styles.rowCenter}>
                        <View >
                            <Text style={styles.txtInterest}>{Languages.invest.payed}</Text>
                            <Text style={styles.txtFormality}>{Utils.formatMoney(data?.tong_goc_da_tra)}</Text>
                        </View>
                        <View style={styles.wrapText}>
                            <Text style={styles.txtInterest}>{Languages.invest.remaining}</Text>
                            <Text style={styles.greenText}>{Utils.formatMoney(data?.tong_goc_con_lai)}</Text>
                        </View>
                    </View>
                </>}
                {title !== ENUM_INVEST_STATUS.INVEST_NOW && <>
                    <Dash
                        dashThickness={1}
                        dashLength={10}
                        dashGap={5}
                        dashColor={COLORS.GRAY_13} />
                    <View style={styles.rowCenter}>
                        <View >
                            <Text style={styles.txtInterest}>{Languages.invest.dateInvest}</Text>
                            <Text style={styles.txtFormality}>{data?.ngay_dau_tu}</Text>
                        </View>
                        <View style={styles.wrapText}>
                            <Text style={styles.txtInterest}>{title == ENUM_INVEST_STATUS.INVESTING ? Languages.invest.dueDateETA : Languages.invest.dueDate}</Text>
                            <Text style={styles.greenText}>{data?.ngay_dao_han}</Text>
                        </View>
                    </View>
                </>}
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_13} />
                <View style={styles.rowBottom}>
                    <View>
                        <Text style={styles.txtInterest} >{Languages.invest.formalPayment}</Text>
                        <Text style={styles.txtFormality}>{data?.hinh_thuc_tra_lai}</Text>
                    </View>
                    {title !== ENUM_INVEST_STATUS.INVEST_NOW &&
                        <View style={styles.wrapText}>
                            <Text style={styles.txtInterest} >{Languages.invest.getMoney}</Text>
                            <Text style={styles.txtYellow}>{Utils.formatMoney(data?.tong_lai_da_tra)}</Text>
                        </View>}
                </View>
            </Touchable>
            {title === ENUM_INVEST_STATUS.INVEST_NOW &&
                <View style={styles.wrapBtn}>
                    <Touchable style={styles.btInvestNow} onPress={title === ENUM_INVEST_STATUS.INVEST_NOW ? onPressInvestNow : onPress}>
                        <Text style={styles.txtInvestNow}>{Languages.invest.investNow}</Text>
                        <IcBtnInvest />
                    </Touchable >
                </View>
            }
        </View>
    );
};
const styles = StyleSheet.create({
    item: {
        paddingTop: 8,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        marginBottom: 8,
        flex: 1
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 8
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        width: '100%'
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 8
    },
    txtMoney: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GREEN
    },
    txtInterest: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size10,
        color: COLORS.GRAY_12
    },
    txtPercent: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    wrapText: {
        alignItems: 'flex-end'
    },
    greenText: {
        ...Styles.typography.medium,
        color: COLORS.GREEN
    },
    btInvestNow: {
        backgroundColor: COLORS.GREEN,
        flexDirection: 'row',
        paddingVertical: 5,
        borderRadius: 20,
        paddingHorizontal: 7,
        alignItems: 'center'

    },
    txtInvestNow: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size10,
        marginRight: 5
    },
    txtFormality: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size13
    },
    txtYellow: {
        ...Styles.typography.medium,
        color: COLORS.YELLOW_2
    },
    wrapBtn: {
        position: 'absolute',
        bottom: 12,
        right: 16
    }
});
export default ItemInvest;


