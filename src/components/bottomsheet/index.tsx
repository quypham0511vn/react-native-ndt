import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { debounce } from 'lodash';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import IcFindingContract from '@/assets/image/common/ic_search.svg';
import { Configs, PADDING_BOTTOM } from '@/common/Configs';
import Languages from '@/common/Languages';
import MyStyleBottomSheet from '@/components/bottomSheet/styles';
import { COLORS } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { BottomSheetAction, BottomSheetProps } from './types';

const styles = MyStyleBottomSheet();

export type ItemProps = {
    value?: string;
    id?: string;
    selected?: boolean;
    price?: string;
};

const CustomBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />;

const BottomSheetComponent = forwardRef<BottomSheetAction, BottomSheetProps>(
    ({ data, onPressItem, isCheckboxList }: BottomSheetProps, ref) => {

        const bottomSheetModalRef = useRef<BottomSheetModal>(null);

        const [textSearch, setTextSearch] = useState('');
        const [dataFilter, setDataFilter] = useState<ItemProps[]>();
        const [focus, setFocus] = useState<boolean>(false);

        useEffect(() => {
            setDataFilter(data);
        }, [data]);

        const snapPoints = useMemo(() => {
            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + PADDING_BOTTOM + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);  // + input height
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 15);
            ratio = Math.min(ratio, 70);

            return [`${ratio}%`, `${ratio}%`];
        }, [data]);

        const show = useCallback(() => {
            bottomSheetModalRef.current?.present();
        }, []);

        const hide = useCallback(() => {
            bottomSheetModalRef.current?.close();
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const handleSheetChanges = useCallback(() => { }, []);

        const searchItem = useCallback(
            (text: string) => {
                if (text) {
                    setDataFilter(
                        data?.filter((item) =>
                            item.value?.toUpperCase().includes(text.toUpperCase())
                        )
                    );
                }
                if (text === '') {
                    setDataFilter(data);
                }
            },
            [data]
        );

        const debounceSearchItem = useCallback(
            debounce((text: string) => searchItem(text), 0),
            [searchItem]
        );
        const handleInputOnchange = useCallback(
            (value: string) => {
                setTextSearch(value);
                debounceSearchItem(value);
            },
            [debounceSearchItem]
        );

        const renderItem = useCallback(
            ({ item }: any) => {
                const onPressCheckbox = () => {
                    onPressItem?.(item);
                };
                const onPress = () => {
                    onPressItem?.(item);
                    hide();
                };
                if (isCheckboxList === true) {
                    return (
                        <TouchableOpacity
                            style={styles.wrapCheckbox}
                            onPress={onPressCheckbox}
                        >
                            <CheckBox
                                boxType="square"
                                value={item?.selected}
                                style={styles.checkbox}
                                onCheckColor={COLORS.GREEN}
                                onTintColor={COLORS.GREEN}
                                animationDuration={0.2}
                                onAnimationType="fade"
                                offAnimationType="fade"
                                lineWidth={1}
                                tintColors={{ true: COLORS.GREEN, false: COLORS.BLACK }}
                            />
                            <Text style={styles.txt}>{item.value}</Text>
                        </TouchableOpacity>
                    );
                }
                return (
                    <TouchableOpacity onPress={onPress} style={styles.item}>
                        <Text style={styles.txt}>{item.value}</Text>
                    </TouchableOpacity>
                );
            },
            [hide, isCheckboxList, onPressItem]
        );

        const keyExtractor = useCallback((item: any, index: number) => `${index}`, []);
        const onFocus = useCallback(() => {
            setFocus(true);
        }, []);

        const renderTextInput = useMemo(() => {
            const num = data?.length as number;
            if (num > MIN_SIZE_HAS_INPUT) {
                return (
                    <View style={styles.searchContainer}>
                        <TouchableOpacity
                            onPress={() => handleInputOnchange(textSearch)}
                            style={styles.wrapIcon}
                        >
                            <IcFindingContract />
                        </TouchableOpacity>
                        <BottomSheetTextInput
                            value={textSearch}
                            style={[
                                styles.input,
                                { borderColor: focus ? COLORS.GREEN : COLORS.GRAY }
                            ]}
                            onChangeText={handleInputOnchange}
                            onFocus={onFocus}
                            placeholder={Languages.common.search}
                            placeholderTextColor={COLORS.BACKDROP}
                        />
                    </View>
                );
            }
            return null;
        }, [data?.length, focus, handleInputOnchange, onFocus, textSearch]);

        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={CustomBackdrop}
                keyboardBehavior={'interactive'}
            >
                <View style={styles.contentContainer}>
                    {renderTextInput}
                    <BottomSheetFlatList
                        data={dataFilter}
                        renderItem={renderItem}
                        style={styles.flatList}
                        contentContainerStyle={styles.flatListContainer}
                        keyExtractor={keyExtractor}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

export default BottomSheetComponent;

const ITEM_HEIGHT = Configs.FontSize.size40;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;
