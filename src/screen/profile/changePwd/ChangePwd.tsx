import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';

import Languages from '@/common/Languages';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderBar from '@/components/header';
import HideKeyboard from '@/components/HideKeyboard';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { MyStylesChangePwd } from './styles';
import arrayIcon from '@/common/arrayIcon';
import { isIOS } from '@/common/Configs';
import Loading from '@/components/loading';

const ChangePwd = observer(() => {
    const styles = MyStylesChangePwd();
    const { userManager, apiServices } = useAppStore();

    const [oldPwd, setOldPwd] = useState<string>('');
    const [newPwd, setNewPwd] = useState<string>('');
    const [currentNewPwd, setCurrentNewPwd] = useState<string>('');

    const [isLoading, setLoading] = useState<boolean>(false);

    const oldRef = useRef<TextFieldActions>(null);
    const newRef = useRef<TextFieldActions>(null);
    const currentRef = useRef<TextFieldActions>(null);

    const onChangeText = useCallback((value?: any, tag?: any) => {
        switch (tag) {
            case Languages.changePwd.oldPass:
                setOldPwd(value);
                break;
            case Languages.changePwd.newPass:
                setNewPwd(value);
                break;
            case Languages.changePwd.currentNewPass:
                setCurrentNewPwd(value);
                break;
            default:
                break;
        }
    }, []);

    const renderInput = useCallback((_title?: any, _placeHolder?: any, _text?: string, _ref?: any, visible?: boolean, disabled?: boolean) => {
        const onChange = (text: string) => {
            onChangeText(text, _title);
        };
        if (visible) {
            return <View style={styles.groupInput}>
                <Text style={styles.title}>{_title}</Text>
                <MyTextInput
                    ref={_ref}
                    placeHolder={_placeHolder}
                    containerInput={!disabled ? styles.containerStyle : styles.containerDisableStyle}
                    inputStyle={styles.inputStyle}
                    isPassword={true}
                    inputStylePwDIcon={styles.pwd}
                    maxLength={50}
                    value={_text}
                    keyboardType={'DEFAULT'}
                    onChangeText={onChange}
                    hasUnderline={false}
                    rightIcon={arrayIcon.login.pass}
                    disabled={disabled}
                />
            </View>;
        }
        return null;
    }, [onChangeText, styles.containerDisableStyle, styles.containerStyle, styles.groupInput, styles.inputStyle, styles.pwd, styles.title]);

    const onChangeValidation = useCallback(
        () => {
            let oldPwdValidation = '';
            if (userManager.userInfo?.password) {
                oldPwdValidation = FormValidate.passValidate(oldPwd);
            }
            oldRef.current?.setErrorMsg(oldPwdValidation);
            const newPwdValidation = FormValidate.passValidate(newPwd);
            const currentPwdValidation = FormValidate.passConFirmValidate(currentNewPwd, newPwd);

            newRef.current?.setErrorMsg(newPwdValidation);
            currentRef.current?.setErrorMsg(currentPwdValidation);

            if (`${oldPwdValidation}${currentPwdValidation}${newPwdValidation}`.length === 0) {
                return true;
            }
            return false;
        },
        [userManager.userInfo?.password, newPwd, currentNewPwd, oldPwd]
    );

    const onPressChange = useCallback(async () => {
        if (onChangeValidation()) {
            setLoading(true);
            const res = await apiServices.auth.changePwd(oldPwd, currentNewPwd);
            if (res.success) {
                setLoading(false);
                Navigator.goBack();
                ToastUtils.showSuccessToast(Languages.changePwd.successNotify);
            }
            setLoading(false);
        }
    }, [apiServices.auth, currentNewPwd, oldPwd, onChangeValidation]);

    return (
        <HideKeyboard style={styles.container}>
            <View style={styles.container}>
                <HeaderBar
                    title={Languages.changePwd.title} hasBack />
                <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'}>
                    <ScrollView>
                        <View style={styles.group}>
                            {renderInput(Languages.changePwd.oldPass,
                                Languages.changePwd.placeOldPass,
                                oldPwd,
                                oldRef,
                                userManager.userInfo?.password,
                                false)}
                            {renderInput(Languages.changePwd.newPass,
                                Languages.changePwd.placeNewPass,
                                newPwd,
                                newRef,
                                true,
                                false)}
                            {renderInput(Languages.changePwd.currentNewPass,
                                Languages.changePwd.currentNewPass,
                                currentNewPwd,
                                currentRef,
                                true,
                                !newPwd)}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={styles.button}>
                    <Button
                        label={`${Languages.changePwd.confirmPwd}`}
                        buttonStyle={userManager.userInfo?.password
                            ? !!oldPwd && newPwd && currentNewPwd ? BUTTON_STYLES.GREEN : BUTTON_STYLES.GRAY
                            : newPwd && currentNewPwd ? BUTTON_STYLES.GREEN : BUTTON_STYLES.GRAY
                        }
                        onPress={onPressChange}
                        isLowerCase
                        style={styles.btnStyle}
                        disabled={userManager.userInfo?.password
                            ? `${oldPwd}`.length === 0 || `${newPwd}`.length === 0 || `${currentNewPwd}`.length === 0
                            : `${newPwd}`.length === 0 || `${currentNewPwd}`.length === 0
                        }
                    />
                </View>
                {isLoading && <Loading isOverview />}
            </View>
        </HideKeyboard>
    );
});

export default ChangePwd;
