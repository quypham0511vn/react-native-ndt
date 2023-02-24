import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import IcLine from '@/assets/image/auth/ic_line_auth.svg';
import arrayIcon from '@/common/arrayIcon';
import Languages from '@/common/Languages';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Touchable } from '@/components/elements/touchable';
import HideKeyboard from '@/components/HideKeyboard';
import Loading from '@/components/loading';
import { useAppStore } from '@/hooks';
import { COLORS } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import OtpSignIn from '../otpSignIn';
import { MyStylesForgotPass } from './styles';

const ForgotPass = observer(() => {
    const {
        apiServices
    } = useAppStore();
    const [phone, setPhone] = useState<string>('');
    const [isNavigate, setNavigate] = useState<boolean>(true);
    const styles = MyStylesForgotPass();
    const refPhone = useRef<TextFieldActions>(null);;
    const [isLoading, setLoading] = useState<boolean>(false);

    const onChangeText = useCallback((value: string) => {
        setPhone(value);
    }, []);

    const onValidate = useCallback(() => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        refPhone.current?.setErrorMsg(errMsgPhone);
        if (`${errMsgPhone}`.length === 0) {
            return true;
        }
        return false;
    }, [phone]);

    const onSentOtp = async () => {
        if (onValidate()) {
            setLoading(true);
            const resForgotOTP = await apiServices.auth.otpResetPwd(phone);

            setLoading(false);
            if (resForgotOTP.success) {
                ToastUtils.showSuccessToast(Languages.confirmPhone.msgCallPhone.replace('%s1', Utils.encodePhone(phone)));
                setNavigate(false);
            }
        }
    };

    return (
        <HideKeyboard>
            <View style={styles.container}>
                {!isNavigate ?

                    <OtpSignIn phone={phone} isChangePass /> :

                    <View style={styles.content}>
                        <View style={styles.viewTitle}>
                            <Text style={styles.txtTitle}>{Languages.auth.titleForgotPass}</Text>
                            <IcLine width={'20%'} />
                        </View>
                        <View style={styles.txtLeft}>
                            <Text style={styles.txt}>{Languages.auth.txtForgotPass}</Text>
                        </View>
                        <MyTextInput
                            ref={refPhone}
                            value={phone}
                            isPhoneNumber={true}
                            maxLength={10}
                            rightIcon={arrayIcon.login.phone}
                            placeHolder={Languages.auth.txtPhone}
                            containerInput={styles.inputPhone}
                            onChangeText={onChangeText}
                            keyboardType={'NUMBER'}
                        />
                        <View style={styles.rowInfo}>
                            <Touchable onPress={onSentOtp} disabled={phone === ''}
                                style={phone !== '' ? styles.tobLogin : [styles.tobLogin, { backgroundColor: COLORS.GRAY_13 }]}>
                                <Text style={phone !== '' ? styles.txtSubmit : [styles.txtSubmit, { color: COLORS.GRAY_12 }]}>
                                    {Languages.auth.sentOTP}
                                </Text>
                            </Touchable>
                        </View>
                    </View>
                }
                {isLoading && <Loading isOverview />}
            </View>
        </HideKeyboard>
    );
});

export default ForgotPass;
