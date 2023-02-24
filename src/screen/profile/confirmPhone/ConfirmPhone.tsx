import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import HumanIC from '@/assets/image/ic_human.svg';
import VimoIC from '@/assets/image/ic_logo_vimo_large.svg';
import Languages from '@/common/Languages';
import ScreenName from '@/common/screenNames';
import { Button } from '@/components/elements/button';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderBar from '@/components/header';
import HideKeyboard from '@/components/HideKeyboard';
import Navigator from '@/routers/Navigator';
import { HtmlStyles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import { MyStylesConfirmPhone } from './styles';
import { useAppStore } from '@/hooks';
import ToastUtils from '@/utils/ToastUtils';
import Loading from '@/components/loading';
import { DataSendLinkVimoModal } from '@/models/payment-link-models';

const ConfirmPhone = observer(() => {
    const { apiServices } = useAppStore();
    const styles = MyStylesConfirmPhone();
    const [phone, setPhone] = useState<string>('');
    const phoneRef = useRef<TextFieldActions>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataSend, setDataSend] = useState<DataSendLinkVimoModal>();

    const renderInput = useCallback((_title?: any, _placeHolder?: any, _text?: string, _ref?: any, leftIcon?: any) => {
        const onChange = (text: string) => {
            setPhone(text);
        };
        return <View style={styles.groupInput}>
            <Text style={styles.title}>{_title}</Text>
            <MyTextInput
                ref={_ref}
                placeHolder={_placeHolder}
                keyboardType={'NUMBER'}
                containerInput={styles.containerStyle}
                inputStyle={styles.inputStyle}
                maxLength={10}
                value={_text}
                onChangeText={onChange}
                hasUnderline={false}
                leftIcon={leftIcon}
            />
        </View>;
    }, [styles.containerStyle, styles.groupInput, styles.inputStyle, styles.title]);

    const onValidation = useCallback(
        () => {
            const phoneValidate = FormValidate.passConFirmPhone(phone);
            phoneRef.current?.setErrorMsg(phoneValidate);

            if (`${phoneValidate}`.length === 0) {
                return true;
            }
            return false;
        },
        [phone]
    );

    const onSendOTP = useCallback(async () => {
        if (onValidation()) {
            setIsLoading(true);
            const res = await apiServices.paymentMethod.requestSendLinkVimo(phone);
            if (res.success) {
                const data = res?.data as DataSendLinkVimoModal;
                setDataSend(data);
                ToastUtils.showSuccessToast(Languages.msgNotify.successSendLinkVimo);
                Navigator.pushScreen(ScreenName.verifyOTP, { linked_code: data.linked_id, phoneNumber: phone });
                setIsLoading(false);
            }
            setIsLoading(false);
        }
    }, [apiServices.paymentMethod, onValidation, phone]);

    return (
        <HideKeyboard style={styles.container}>
            <View style={styles.container}>
                <HeaderBar isLight={false} title={Languages.confirmPhone.confirmPhone} hasBack />
                <View style={styles.logo}>
                    <VimoIC />
                </View>
                <View style={styles.wrapAllContent}>
                    <HTMLView
                        value={Languages.confirmPhone.noteConfirmPhone}
                        stylesheet={HtmlStyles || undefined}
                    />
                    {renderInput(Languages.confirmPhone.phone, Languages.confirmPhone.inputPhone, phone, phoneRef, <HumanIC />)}
                    <Button label={Languages.confirmPhone.sendOTP}
                        buttonStyle={BUTTON_STYLES.GREEN}
                        isLowerCase
                        onPress={onSendOTP}
                    />
                    {isLoading && <Loading isOverview />}
                </View>
            </View>
        </HideKeyboard >
    );
});

export default ConfirmPhone;

