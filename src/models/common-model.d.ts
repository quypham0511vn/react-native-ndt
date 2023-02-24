import { CropRect } from 'react-native-image-crop-picker';

export type ItemProps = {
    value?: string;
    text?: string;
    id?: string;
    icon?: string;
};

export type IMAGES = {
    CropRect: CropRect | undefined;
    path?: string | undefined;
    size: number | undefined;
    width: number | undefined;
    height: number | undefined;
    mime: string | undefined;
    filename: string | undefined;
    creationDate: string | undefined;
    modificationDate?: string | undefined;
    sourceURL: string | undefined;
    localIdentifier?: string | undefined;
    exif: object | undefined;
    uri: string | undefined;
    type: string | undefined;
    name: string | undefined;
};

export type UpLoadImage = {
    images: Array<IMAGES> | undefined;
    code: number | undefined;
};
