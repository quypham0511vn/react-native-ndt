import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import KYCVerifyIcon from '@/assets/image/ic_acc_verified.svg';
import KYCIcon from '@/assets/image/ic_KYC_account.svg';
import TickedIcon from '@/assets/image/ic_ticked_round.svg';
import Languages from '@/common/Languages';
import ScreenName from '@/common/screenNames';
import { Touchable } from '@/components/elements/touchable';
import HeaderBar from '@/components/header';
import Navigator from '@/routers/Navigator';
import { MyStylesAccountInfo } from './styles';
import { useAppStore } from '@/hooks';
import { STATE_VERIFY_ACC } from '@/common/constants';
import KeyValueReport from '@/components/KeyValueReport';
import { typeGender } from '@/mocks/data';

const AccountInfo = observer(() => {
    const { userManager } = useAppStore();
    const styles = MyStylesAccountInfo();
    const [genderUser, setGender] = useState<string>('');

    useEffect(() => {
        switch (userManager.userInfo?.gender) {
            case typeGender[0].text:
                return setGender(typeGender[0].value);
            case typeGender[1].text:
                return setGender(typeGender[1].value);
            default:
                return setGender('');
        }
    }, [userManager.userInfo?.gender]);

    const onNavigateKYC = useCallback(() => Navigator.pushScreen(ScreenName.accountIdentify), []);

    const onNavigateEdit = useCallback(() => Navigator.pushScreen(ScreenName.editAccountInfo), []);

    const renderTopAcc = useCallback((image?: any, content?: string, titleAccuracyState?: string, accuracyStateWrap?: ViewStyle, accuracyStateText?: TextStyle) => (
        <>
            {image}
            {content !== '' && <Text style={styles.txtContentKYC}>{content}</Text>}
            <Touchable style={accuracyStateWrap} onPress={onNavigateKYC}>
                <Text style={accuracyStateText}>{titleAccuracyState}</Text>
            </Touchable>
        </>
    ), [onNavigateKYC, styles.txtContentKYC]);

    const renderAccuracy = useMemo(() => {
        switch (userManager.userInfo?.tinh_trang?.status) {
            case STATE_VERIFY_ACC.VERIFIED:
                return <>{renderTopAcc(<KYCVerifyIcon />, '', Languages.account.accVerified, styles.accuracyWrap, styles.txtAccuracy)}</>;
            case STATE_VERIFY_ACC.NO_VERIFIED:
                return <>{renderTopAcc(<KYCIcon />, Languages.accountInfo.content, Languages.account.accuracyNow, styles.notAccuracyWrap, styles.txtNotAccuracy)}</>;
            case STATE_VERIFY_ACC.WAIT:
                return <>{renderTopAcc(<KYCIcon />, Languages.accountInfo.noteWaitVerify, Languages.accountInfo.accWaitVerify, styles.waitAccuracyWrap, styles.txtWaitAccuracy)}</>;
            default:
                return <>{renderTopAcc(<KYCIcon />, Languages.accountInfo.content, Languages.account.accuracyNow, styles.notAccuracyWrap, styles.txtNotAccuracy)}</>;
        }
    }, [renderTopAcc, styles.accuracyWrap, styles.notAccuracyWrap, styles.txtAccuracy, styles.txtNotAccuracy, styles.txtWaitAccuracy, styles.waitAccuracyWrap, userManager.userInfo?.tinh_trang?.status]);

    const renderKeyFeature = useCallback((title: string, content?: string, isTicked?: boolean, numberOfLine?: number) => (
        <KeyValueReport title={title}
            content={content || undefined}
            styleTouchable={styles.wrapAllItemInfo}
            containerContent={content && isTicked ? styles.wrapCheckedInfo : styles.wrapUnCheckedInfo}
            styleTitle={styles.styleTextInfo}
            styleColor={content && isTicked ? styles.styleValueCheckedInfo : styles.styleValueUnCheckedInfo}
            noIndicator
            rightIcon={content && isTicked ? <TickedIcon /> : null}
            hasDashBottom
            numberOfLine={numberOfLine}
        />
    ), [styles.styleTextInfo, styles.styleValueCheckedInfo, styles.styleValueUnCheckedInfo, styles.wrapAllItemInfo, styles.wrapCheckedInfo, styles.wrapUnCheckedInfo]);

    const renderInfoAcc = useMemo(() => (
        <View style={styles.wrapContent}>
            {renderKeyFeature(Languages.accountInfo.phoneNumber, userManager.userInfo?.phone_number, true)}
            {renderKeyFeature(Languages.accountInfo.email, userManager.userInfo?.email, true)}
            {renderKeyFeature(Languages.accountInfo.fullName, userManager.userInfo?.full_name, false, 2)}
            {renderKeyFeature(
                Languages.accountInfo.gender,
                genderUser
            )}
            {renderKeyFeature(Languages.accountInfo.address, userManager.userInfo?.address, false, 2)}
            <View style={styles.wrapEdit}>
                <Touchable style={styles.accuracyWrap} onPress={onNavigateEdit}>
                    <Text style={styles.txtAccuracy}>{Languages.accountInfo.edit}</Text>
                </Touchable>
            </View>
        </View>
    ), [genderUser, onNavigateEdit, renderKeyFeature, styles.accuracyWrap, styles.txtAccuracy, styles.wrapContent, styles.wrapEdit, userManager.userInfo?.address, userManager.userInfo?.email, userManager.userInfo?.full_name, userManager.userInfo?.phone_number]);

    return (
        <View style={styles.container}>
            <HeaderBar isLight={false} title={Languages.accountInfo.accountInfo} hasBack />
            <ScrollView style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    {renderAccuracy}
                </View>
                {renderInfoAcc}
            </ScrollView>
        </View>
    );
});

export default AccountInfo;
