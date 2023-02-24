import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { COLORS, Styles } from '@/theme';
import { PopupPropsTypes as PopupPropTypes } from '@/models/typesPopup';
import { PopupActions } from './popupInvest/types';
import { ENUM_BIOMETRIC_TYPE } from '@/common/constants';
import { Configs } from '@/common/Configs';

interface PopupAlertFingerProps extends PopupPropTypes {
    type?: string;
    btnText?: string;
}

const PopupAlertFinger = forwardRef<PopupActions, PopupAlertFingerProps>(
    ({ title, type }: PopupAlertFingerProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const renderTitle = useMemo(() => {
            if (type === ENUM_BIOMETRIC_TYPE.FACE_ID) {
                return (
                    <Text style={styles.txtTitle}>
                        {/* {Languages.authentication.descriptionFaceId} */}
                    </Text>
                );
            }
            return (
                <Text style={styles.txtTitle}>
                    {/* {Languages.authentication.description} */}
                </Text>
            );
        }, [type]);
        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    {renderTitle}
                    <Text style={styles.txtContent}>{title}</Text>
                </View>
            </Modal>
        );
    }
);

export default PopupAlertFinger;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingTop: 10,
        paddingRight: 15
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15,
        color: COLORS.GREEN
    },
    txtContent: {
        ...Styles.typography.regular,
        marginVertical: 10,
        marginRight: 20,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size13
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    iconFinger: {
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 20
    },
    description: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconClose: {
        alignItems: 'flex-end'
    }
});
