import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, {
    forwardRef,
    useCallback, useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import FastImage from 'react-native-fast-image';

import { Configs } from '@/common/Configs';
import Languages from '@/common/Languages';
import { ItemProps } from '@/models/common-model';
import { COLORS, Styles } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { Touchable } from './elements/touchable';
import HideKeyboard from './HideKeyboard';

type BottomSheetProps = {
    data?: ItemProps[],
    onPressItem?: (item?: any) => any,
    onClose?: () => void,
    onOpen?: () => void,
    hasDash?: boolean,
    leftIcon?: any,
    rightIcon?: any,
    title?: string,
    hasInputSearch?: boolean,
    isValueBank?: boolean
};

export type BottomSheetAction = {
    show?: (content?: string) => any,
    hide?: (content?: string) => any,
};

const BottomSheetComponent = forwardRef<BottomSheetAction, BottomSheetProps>(
    (
        {
            data,
            onPressItem,
            onClose,
            onOpen,
            hasDash,
            leftIcon,
            rightIcon,
            title,
            hasInputSearch,
            isValueBank
        }: BottomSheetProps,

        ref: any
    ) => {

        const bottomSheetRef = useRef<BottomSheetModal>(null);
        const [textSearch, setTextSearch] = useState('');
        const [dataFilter, setDataFilter] = useState<ItemProps[]>();
        const [focus, setFocus] = useState<boolean>(false);
        const isFocus = useIsFocused();

        useEffect(() => {
            setDataFilter(data);
            if (isFocus) {
                setTextSearch('');
            }
        }, [data, isFocus]);

        const snapPoints = useMemo(() => {
            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 25);
            ratio = Math.min(ratio, 70);
            return [`${ratio}%`, `${ratio}%`];
        }, [data]);

        const hide = useCallback(() => {
            bottomSheetRef?.current?.dismiss();
            onClose?.();
        }, [onClose]);

        const show = useCallback(() => {
            onOpen?.();
            bottomSheetRef?.current?.present();
        }, [onOpen]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const searchItem = useCallback(
            (text: string) => {
                if (text) {
                    if (!isValueBank) {
                        setDataFilter(
                            data?.filter((item) =>
                                item?.value?.toUpperCase().includes(text.toUpperCase())
                            )
                        );
                    } else {
                        setDataFilter(
                            data?.filter((item) =>
                                `${item?.value}${' - '}${item?.text}`?.toUpperCase().includes(text.toUpperCase())
                            )
                        );
                    }
                }

                if (text === '') {
                    setDataFilter(data);
                }
            },
            [data, isValueBank]
        );

        const debounceSearchItem = debounce((text: string) => searchItem(text), 0);

        const handleInputOnchange = useCallback(
            (value: string) => {
                setTextSearch(`${value}`);
                debounceSearchItem(value);
            },
            [debounceSearchItem]
        );

        const renderItem = useCallback(
            ({ item }: any) => {
                const onPress = () => {
                    onPressItem?.(item);
                    hide?.();
                };
                return (
                    <>
                        <Touchable onPress={onPress} style={styles.valueContainer}>
                            <View style={styles.row}>
                                {isValueBank && item.icon ?
                                    <FastImage source={{ uri: item.icon }} resizeMode={'contain'} style={styles.fastImage} />
                                    : leftIcon}
                                <Text style={!leftIcon ? styles.value : styles.noLeftIconValue}>{isValueBank ? `${item.value}${' - '}${item.text}` : item.value}</Text>
                                {rightIcon}
                            </View>
                        </Touchable>
                        {hasDash && <Dash
                            dashThickness={1}
                            dashLength={10}
                            dashGap={5}
                            dashColor={COLORS.GRAY_13}
                        />}
                    </>
                );
            },
            [hasDash, hide, isValueBank, leftIcon, onPressItem, rightIcon]
        );

        const onFocus = useCallback(() => {
            setFocus(true);
        }, []);

        const onBlur = useCallback(() => {
            setFocus(false);
        }, []);

        const keyExtractor = useCallback((item: any, index: any) => `${item.id}${index}`, []);

        const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ), []);

        const handleSheetChanges = useCallback((index: number) => {
            setTimeout(() => bottomSheetRef.current?.snapToIndex(index), 0);
        }, []);

        const renderHeader = useCallback(() => (
            <>
                <Text style={styles.txtTitle}>{title}</Text>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_13}
                />
            </>
        ), [title]);


        return (
            <View style={styles.container}>
                <HideKeyboard>
                    <BottomSheetModal
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        backdropComponent={renderBackdrop}
                        keyboardBehavior={'extend'}
                        keyboardBlurBehavior={'restore'}
                        onChange={handleSheetChanges}
                        enableOverDrag={true}
                    >
                        {hasInputSearch && data?.length as number >= MIN_SIZE_HAS_INPUT &&
                            < BottomSheetTextInput
                                placeholder={Languages.common.search}
                                placeholderTextColor={COLORS.BACKDROP}
                                value={textSearch}
                                style={[
                                    styles.input,
                                    { borderColor: focus ? COLORS.GREEN : COLORS.GRAY }
                                ]}
                                onChangeText={handleInputOnchange}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        }
                        <BottomSheetFlatList
                            data={dataFilter}
                            ListHeaderComponent={renderHeader}
                            renderItem={renderItem}
                            style={styles.flatList}
                            keyExtractor={keyExtractor}
                        />
                    </BottomSheetModal>
                </HideKeyboard>
            </View >
        );
    });

export default BottomSheetComponent;
const ITEM_HEIGHT = Configs.FontSize.size40 + 20;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;
const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    valueContainer: {
        width: '100%',
        paddingVertical: 10
    },
    value: {
        flex: 1,
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flatList: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 16
    },
    noLeftIconValue: {
        flex: 1,
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        paddingLeft: 25
    },
    backdropStyle: {
        flex: 1,
        height: SCREEN_HEIGHT
    },
    txtTitle: {
        fontFamily: Configs.FontFamily.bold,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        marginVertical: 8
    },
    input: {
        ...Styles.typography.regular,
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        backgroundColor: COLORS.TRANSPARENT,
        color: COLORS.GREEN,
        marginHorizontal: 16
    },
    fastImage: {
        width: 30,
        height: 30
    }
});
