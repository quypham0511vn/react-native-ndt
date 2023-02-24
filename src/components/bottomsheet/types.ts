// import { ItemProps } from '@/models/common-model';
import { ItemProps } from '@/components/bottomSheet';

export type BottomSheetProps = {
    data?: Array<ItemProps>;
    onPressItem?: (item: any) => void;
    isCheckboxList?: boolean;
};

export type BottomSheetAction = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
};
