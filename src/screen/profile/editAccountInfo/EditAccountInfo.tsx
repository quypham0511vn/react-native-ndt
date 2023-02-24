import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import AvatarIC from '@/assets/image/ic_edit_avatar_large.svg';
import Languages from '@/common/Languages';
import { Button } from '@/components/elements/button';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderBar from '@/components/header';
import HideKeyboard from '@/components/HideKeyboard';
import PhotoPickerBottomSheet from '@/components/PhotoPickerBottomSheet';
import { useAppStore } from '@/hooks';
import { typeGender, typePhoto } from '@/mocks/data';
import { ItemProps, UpLoadImage } from '@/models/common-model';
import FormValidate from '@/utils/FormValidate';
import ImageUtils from '@/utils/ImageUtils';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { MyStylesEditAccountInfo } from './styles';
import { UpdateInfoModal } from '@/models/user-models';
import ScrollViewWithKeyboard from '@/components/scrollViewWithKeyboard';
import PickerBankValuation from '@/components/PickerBankValuation';
import { PopupActionTypes } from '@/models/typesPopup';
import Navigator from '@/routers/Navigator';
import Loading from '@/components/loading';

const EditAccountInfo = observer(() => {
    const { apiServices, userManager } = useAppStore();
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

    const styles = MyStylesEditAccountInfo();
    const [name, setName] = useState<string>(userManager.userInfo?.full_name || '');
    const [emailUser, setEmail] = useState<string>(userManager.userInfo?.email || '');
    const [phone, setPhone] = useState<string>(userManager.userInfo?.phone_number || '');

    const [fetchGender, setFetchGender] = useState<string>(userManager.userInfo?.gender || '');
    const [addressUser, setAddress] = useState<string>(userManager.userInfo?.address || '');
    const [avatarAcc, setAvatarAcc] = useState<UpLoadImage>();
    const [avatarUrl, setAvatarUrl] = useState<string>(userManager.userInfo?.avatar_user || '');
    const [isLoading, setLoading] = useState<boolean>(false);

    const avatarRef = useRef<BottomSheetModal>();
    const nameRef = useRef<TextFieldActions>();
    const phoneRef = useRef<TextFieldActions>();
    const emailRef = useRef<TextFieldActions>();
    const genderRef = useRef<PopupActionTypes>(null);
    const addressRef = useRef<TextFieldActions>();

    const onChangeText = useCallback((value?: any, tag?: any) => {
        switch (tag) {
            case Languages.accountInfo.fullName:
                setName(value);
                break;
            case Languages.accountInfo.gender:
                setGender(value);
                break;
            case Languages.accountInfo.phoneNumber:
                setPhone(value);
                break;
            case Languages.accountInfo.email:
                setEmail(value);
                break;
            case Languages.accountInfo.address:
                setAddress(value);
                break;
            default:
                break;
        }
    }, []);

    const renderKeyFeature = useCallback((ref: any, label: string, value: any, keyboardType?: any, disabled?: boolean, maxLength?: number) => (
        <View style={styles.wrapInput}>
            <Text style={styles.labelStyle}>{label}</Text>
            <MyTextInput
                ref={ref}
                isPhoneNumber={false}
                placeHolder={label}
                keyboardType={keyboardType}
                value={value}
                maxLength={maxLength}
                onChangeText={onChangeText}
                containerInput={styles.inputStyle}
                disabled={disabled}
            />
        </View>
    ), [onChangeText, styles.inputStyle, styles.labelStyle, styles.wrapInput]);

    const onPressItemFrontPhoto = useCallback((item: ItemProps) => {
        if (item?.text === 'Camera') {
            ImageUtils.openCamera(setAvatarAcc);
        } else {
            ImageUtils.openLibrary(setAvatarAcc, 1);
        }
    }, []);

    const renderPhotoPicker = useCallback((ref: any, image: any, icon: any, imageSource?: string) => <PhotoPickerBottomSheet
        ref={ref}
        data={typePhoto}
        image={image}
        icon={icon}
        title={Languages.accountInfo.chooseAvatarUser}
        onPressItem={onPressItemFrontPhoto}
        containerStyle={icon ? styles.circleWrap : styles.noCircleWrap}
        containerImage={styles.noCircleWrap}
        hasDash
        imageSource={imageSource}
    />, [onPressItemFrontPhoto, styles.circleWrap, styles.noCircleWrap]);

    const onGenderChoose = useCallback((item?: any) => {
        setGender(item?.value || '');
        setFetchGender(item?.text || '');
    }, []);

    const onValidate = useCallback(() => {
        const errMsgName = FormValidate.userNameValidate(name);
        nameRef.current?.setErrorMsg(errMsgName);

        if (`${errMsgName}`.length === 0) {
            return true;
        } return false;
    }, [name]);

    const renderGender = useCallback((disable?: boolean) => (
        <View style={styles.wrapBirthday}>
            <Text style={styles.labelBirthdayStyle}>{Languages.accountInfo.gender}</Text>
            <PickerBankValuation
                ref={genderRef}
                data={typeGender}
                value={genderUser}
                placeholder={Languages.accountInfo.gender}
                onPressItem={onGenderChoose}
                btnContainer={disable ? styles.rowItemFilterDisable : styles.rowItemFilter}
                containerStyle={styles.containerItemFilter}
                hasDash
                wrapErrText={styles.textErrorGender}
                styleText={disable ? styles.valuePickerDisable : styles.valuePicker}
                stylePlaceholder={styles.placeHolderPicker}
                disable={disable}
            />
        </View>
    ), [genderUser, onGenderChoose, styles.containerItemFilter, styles.labelBirthdayStyle, styles.placeHolderPicker, styles.rowItemFilter, styles.rowItemFilterDisable, styles.textErrorGender, styles.valuePicker, styles.valuePickerDisable, styles.wrapBirthday]);

    const updateUserInformation = useCallback(async (avatar: any) => {
        setLoading(true);
        const res = await apiServices.auth.updateUserInf(
            avatar,
            name,
            fetchGender,
            addressUser
        );
        setLoading(false);
        if (res.success) {
            const resData = res.data as UpdateInfoModal;
            ToastUtils.showSuccessToast(Languages.accountInfo.successEdit);
            userManager.updateUserInfo({
                ...userManager.userInfo,
                full_name: name,
                avatar_user: avatar,
                gender: fetchGender,
                address: addressUser
            });
            Navigator.goBack();
        }
    }, [addressUser, apiServices.auth, fetchGender, name, userManager]);

    const uploadImages = useCallback(async (file: any) => {
        const res = await apiServices?.image.uploadImage(
            file,
            Languages.errorMsg.uploading
        );
        if (res.success) {
            const data = res?.data;
            console.log('data = ', JSON.stringify(data));
            setAvatarUrl(data);
            updateUserInformation(data);
        }
    }, [apiServices?.image, updateUserInformation]);

    const onSaveInfo = useCallback(async () => {
        if (onValidate()) {
            if (avatarAcc) {
                uploadImages(avatarAcc?.images?.[0]);
            }
            else updateUserInformation(userManager.userInfo?.avatar_user);
        }
    }, [avatarAcc, onValidate, updateUserInformation, uploadImages, userManager.userInfo?.avatar_user]);

    const renderInfoAcc = useMemo(() => (
        <View style={styles.wrapContent}>
            {renderKeyFeature(nameRef, Languages.accountInfo.fullName, Utils.formatForEachWordCase(name), 'DEFAULT', false, 30)}
            {renderGender(false)}
            {renderKeyFeature(phoneRef, Languages.accountInfo.phoneNumber, phone, 'PHONE', !!userManager.userInfo?.phone_number, 10)}
            {renderKeyFeature(emailRef, Languages.accountInfo.email, emailUser, 'EMAIL', !!userManager.userInfo?.email, 50)}
            {renderKeyFeature(addressRef, Languages.accountInfo.address, Utils.formatForEachWordCase(addressUser), 'DEFAULT', false, 100)}
            <View style={styles.wrapEdit}>
                <Button
                    style={styles.accuracyWrap}
                    onPress={onSaveInfo}
                    label={Languages.accountInfo.save}
                    buttonStyle={BUTTON_STYLES.GREEN_1}
                    isLowerCase />
            </View>
        </View>
    ), [addressUser, emailUser, name, onSaveInfo, phone, renderGender, renderKeyFeature, styles.accuracyWrap, styles.wrapContent, styles.wrapEdit, userManager.userInfo?.email, userManager.userInfo?.phone_number]);

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <HeaderBar isLight={false} title={Languages.accountInfo.editAcc} hasBack />
                <HideKeyboard>
                    <ScrollViewWithKeyboard showsHorizontalScrollIndicator={false}>
                        <View style={styles.topContainer}>
                            {renderPhotoPicker(avatarRef,
                                avatarAcc,
                                <AvatarIC />,
                                userManager.userInfo?.avatar_user)}
                        </View>
                        {renderInfoAcc}
                        {isLoading && <Loading isOverview />}
                    </ScrollViewWithKeyboard>
                </HideKeyboard>
            </View>
        </View>
    );
});

export default EditAccountInfo;
