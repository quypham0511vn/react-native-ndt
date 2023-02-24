import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { ViewProps } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { useAppStore } from '@/hooks';
import SessionManager from '@/manager/SessionManager';
import Home from '@/screen/home';
import { NotifyInvest } from '@/screen/home/notifyInvest';
import Investment from '@/screen/investment';
import { DetailInvestment } from '@/screen/investment/detailInvestment';
import Invest from '@/screen/investment/invest';
import PaymentWebview from '@/screen/investment/paymentWebview';
import TransferScreen from '@/screen/investment/tranferBank';
import Transaction from '@/screen/payment/Transaction';
import Profile from '@/screen/profile';
import AccountBank from '@/screen/profile/accountBank/AccountBank';
import AccountIdentify from '@/screen/profile/accountIdentify/AccountIdentify';
import AccountInfo from '@/screen/profile/accountInfo/AccountInfo';
import AccountLink from '@/screen/profile/accountLink/AcountLink';
import ChangePwd from '@/screen/profile/changePwd/ChangePwd';
import ConfirmPhone from '@/screen/profile/confirmPhone/ConfirmPhone';
import EditAccountInfo from '@/screen/profile/editAccountInfo/EditAccountInfo';
import LinkWallet from '@/screen/profile/linkWallet/LinkWallet';
import MyWebView from '@/screen/profile/myWedView/MyWebView';
import PaymentMethod from '@/screen/profile/paymentMethod/PaymentMethod';
import ReferralUsers from '@/screen/profile/referral/ReferralUsers';
import ShareFriend from '@/screen/profile/shareFriend/ShareFriend';
import VerifyOTP from '@/screen/profile/verifyOTP/VerifyOTP';
import Report from '@/screen/report';
import { COLORS } from '@/theme';
import ScreenName, { TabsName } from '../common/screenNames';
import Navigator from './Navigator';
import { PromotionDetail } from '@/screen/home/notifyInvest/promotionDetail';

const TabsData = [
    {
        name: TabsName.homeTabs,
        icon: ICONS.HOME,
        color: COLORS.GRAY,
        index: 0
    },
    {
        name: TabsName.investTabs,
        icon: ICONS.INVEST,
        color: COLORS.GRAY,
        index: 1
    },
    {
        name: TabsName.reportTabs,
        icon: ICONS.REPORT,
        color: COLORS.GRAY,
        index: 2
    },
    {
        name: TabsName.paymentTabs,
        icon: ICONS.TRANSACTION,
        color: COLORS.GRAY,
        index: 3
    },
    {
        name: TabsName.accountTabs,
        icon: ICONS.ACCOUNT,
        color: COLORS.GRAY,
        index: 4
    }

];

const screenOptions = { headerShown: false };
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PackageInvestStack =  () => (
    <>
        <Stack.Screen name={ScreenName.detailInvestment} component={DetailInvestment} />
        <Stack.Screen name={ScreenName.paymentWebview} component={PaymentWebview} />
        <Stack.Screen name={ScreenName.transferScreen} component={TransferScreen} />
        <Stack.Screen name={ScreenName.invest} component={Invest} />
    </>
);

const HomeStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenName.home} component={Home} />
        <Stack.Screen name={ScreenName.notifyInvest} component={NotifyInvest} />
        <Stack.Screen name={ScreenName.myWedView} component={MyWebView} />
        <Stack.Screen name={ScreenName.promotionDetail} component={PromotionDetail} />
        {PackageInvestStack()}
    </Stack.Navigator>
);

const InvestStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenName.investment} component={Investment} />
        {PackageInvestStack()}
    </Stack.Navigator>
);

const ReportStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenName.report} component={Report} />
    </Stack.Navigator>
);

const PaymentStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenName.transaction} component={Transaction} />
    </Stack.Navigator>
);

const AccountStack = ({ navigation }: any) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            Navigator.navigateToDeepScreen([TabsName.accountTabs], ScreenName.account);
        });
        return unsubscribe;
    }, [navigation]);
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenName.account} component={Profile} />
            <Stack.Screen name={ScreenName.accountInfo} component={AccountInfo} />
            <Stack.Screen name={ScreenName.editAccountInfo} component={EditAccountInfo} />
            <Stack.Screen name={ScreenName.accountIdentify} component={AccountIdentify} />
            <Stack.Screen name={ScreenName.shareFriend} component={ShareFriend} />
            <Stack.Screen name={ScreenName.changePwd} component={ChangePwd} />
            <Stack.Screen name={ScreenName.accountLink} component={AccountLink} />
            <Stack.Screen name={ScreenName.paymentMethod} component={PaymentMethod} />
            <Stack.Screen name={ScreenName.accountBank} component={AccountBank} />
            <Stack.Screen name={ScreenName.confirmPhone} component={ConfirmPhone} />
            <Stack.Screen name={ScreenName.verifyOTP} component={VerifyOTP} />
            <Stack.Screen name={ScreenName.myWedView} component={MyWebView} />
            <Stack.Screen name={ScreenName.linkWallet} component={LinkWallet} />
            <Stack.Screen name={ScreenName.referralUsers} component={ReferralUsers} />
        </Stack.Navigator>
    );
};

const TabBar = ({ props }: any) => {
    const { focused, size, tabName } = props;

    const tab = TabsData.filter((item) => item.name === tabName)[0];

    const getColor = useCallback(() => {
        if (focused) return COLORS.GREEN;
        return COLORS.GRAY_6;
    }, [focused]);

    return (
        <IconTienngay
            name={tab.icon}
            color={getColor()}
            size={size}
        />
    );
};

const MyBottomTabs = observer(() => {
    const { userManager, fastAuthInfoManager } = useAppStore();

    const onTabPress = useCallback((e: any, navigation: any, route: any) => {
        e?.preventDefault();
        const tab = TabsData.filter((item) => item.name === route?.name)[0];
        if ((route?.name !== TabsName.homeTabs && !userManager?.userInfo) || fastAuthInfoManager.isEnableFastAuth) {
            navigation.navigate(ScreenName.authStack);
            SessionManager.lastTabIndexBeforeOpenAuthTab = tab?.index;
        }
        else {
            navigation.navigate(route?.name);
        }

    }, [fastAuthInfoManager.isEnableFastAuth, userManager?.userInfo]);

    const getTabBarVisibility = useCallback((route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (
            routeName === undefined ||
            routeName === ScreenName.home ||
            routeName === ScreenName.investment ||
            routeName === ScreenName.report ||
            routeName === ScreenName.transaction ||
            routeName === ScreenName.account
        ) {
            return { display: 'flex' };
        }
        return { display: 'none' };
    }, []);

    const getOptions = useCallback((props: any) => ({
        tabBarIcon: (data: any) => <TabBar props={{ ...data, tabName: props.route.name }} />,
        tabBarStyle: getTabBarVisibility(props?.route) as ViewProps
    }), [getTabBarVisibility]);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.GREEN,
                tabBarInactiveTintColor: COLORS.GRAY,
                tabBarStyle: { 
                    padding: 5
                }
            }}
        >
            <Tab.Screen
                name={TabsName.homeTabs}
                component={HomeStack}
                options={getOptions}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        onTabPress(e, navigation, route);
                    }
                })}
            />
            <Tab.Screen
                name={TabsName.investTabs}
                component={InvestStack}
                options={getOptions}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        onTabPress(e, navigation, route);
                    }
                })}
            />
            <Tab.Screen
                name={TabsName.reportTabs}
                component={ReportStack}
                options={getOptions}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        onTabPress(e, navigation, route);
                    }
                })}
            />
            <Tab.Screen
                name={TabsName.paymentTabs}
                component={PaymentStack}
                options={getOptions}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        onTabPress(e, navigation, route);
                    }
                })}
            />
            <Tab.Screen
                name={TabsName.accountTabs}
                component={AccountStack}
                options={getOptions}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        onTabPress(e, navigation, route);
                    }
                })}
            />

        </Tab.Navigator>
    );

});

export default MyBottomTabs;
