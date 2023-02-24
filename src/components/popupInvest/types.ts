import { ItemProps } from '../bottomSheet';

export type PopupProps = {
    onClose?: () => any;
    onConfirm?: (txt1: string, txt2: string) => any;
    onChange?: (value: string, title: string) => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    description?: string;
    title?: string,
    data?: [],
    value?: string,
    openBottomSheet?: (type: string) => void,
    timeInvestment?: ItemProps,
    moneyInvestment?: ItemProps
};

export type PopupActions = {
    show: (content?: string) => any;
    hide: (content?: string) => any;
    setContent?: (message: string) => void;
    clear?: () => void
};


