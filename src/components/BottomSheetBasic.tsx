import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
    SCREEN_HEIGHT
} from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    useCallback, useImperativeHandle,
    useMemo,
    useRef
} from 'react';
import { Text, View,StyleSheet } from 'react-native';
import Dash from 'react-native-dash';

import { Configs, PADDING_BOTTOM } from '@/common/Configs';
import { Touchable } from '@/components/elements/touchable';
import { ItemProps } from '@/models/common-model';
import { COLORS, Styles } from '@/theme';


type BottomSheetProps = {
    data?: ItemProps[],
    onPressItem?: (item?: string, titlePicker?: string) => any,
    onClose?: () => void,
    onOpen?: () => void,
    title?: string
};

export type BottomSheetAction = {
    show?: (content?: string) => any,
    hide?: (content?: string) => any,
};

const CustomBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />;

const BottomSheetBasic = forwardRef<BottomSheetAction, BottomSheetProps>(
    (
        {
            data,
            onPressItem,
            onClose,
            onOpen,
            title
        }: BottomSheetProps,
        ref: any
    ) => {

        const bottomSheetRef = useRef<BottomSheetModal>(null);
        const snapPoints = useMemo(() => {
            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + PADDING_BOTTOM + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 40);
            ratio = Math.min(ratio, 70);

            return [`${ratio}%`, `${ratio}%`];
        }, [data]);

        const hide = useCallback(() => {
            bottomSheetRef.current?.dismiss();
        }, []);

        const show = useCallback(() => {
            onOpen?.();
            bottomSheetRef?.current?.present();
        }, [onOpen]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const renderItem = useCallback(
            ({ item }: any) => {
                const onPress = () => {
                    hide();
                    onPressItem?.(item, title);
                };
                return (
                    <Touchable onPress={onPress} style={styles.valueContainer}>
                        <View style={styles.row}>
                            <Text style={styles.value}>
                                {item.value}
                            </Text>
                        </View>
                        <View style={styles.dash}>
                            <Dash
                                dashThickness={0.5}
                                dashLength={10}
                                dashGap={5}
                                dashColor={COLORS.GRAY_4} />
                        </View>
                    </Touchable>
                );
            },
            [hide, onPressItem, title]
        );

        const keyExtractor = useCallback((index: any) => `${index.id}`, []);
        const handleSheetChanges = useCallback(() => { }, []);

        return (
            <BottomSheetModal
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                backdropComponent={CustomBackdrop}
                keyboardBehavior={'interactive'}
                onChange={handleSheetChanges}
                onDismiss={onClose}
            >
                <View style={styles.container}>
                    <Text style={styles.txtTitle}>{title?.toString().toUpperCase()}</Text>
                    <BottomSheetFlatList
                        data={data}
                        testID={title}
                        renderItem={renderItem}
                        style={styles.flatList}
                        keyExtractor={keyExtractor}
                    />
                </View>

            </BottomSheetModal>
        );
    });
export default BottomSheetBasic;

const ITEM_HEIGHT = Configs.FontSize.size40;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;
const styles = StyleSheet.create({
    container:{
        flex:1
    },
   
    valueContainer: {
        paddingTop: 10
    },
    value: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size14,
        marginHorizontal: 16,
        paddingBottom: 10
    },
    row: {
    },
    flatList: {
        flex: 1,
        marginTop: 0,
        marginBottom: PADDING_BOTTOM
    },
    txtTitle: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        textAlign: 'center',
        fontSize: Configs.FontSize.size16,
        marginVertical: 5
    },
    dash: {
    }
   
}
);
