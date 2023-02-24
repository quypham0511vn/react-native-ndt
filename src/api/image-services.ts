import { isIOS } from '@/common/Configs';
import Languages from '@/common/Languages';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class ImageServices extends BaseService {

    uploadImage = async (file: any, lbMsg?: string) => {

        const form = new FormData();
        form.append('file', {
            // ...file,
            uri: isIOS ? `${'file://'}${file?.path}` || file : file?.path || file,
            name:  `${Math.random()}.jpg`,
            type: 'image/*',
            path: isIOS ? `${'file:/'}${file?.path}` : file?.path
        } as any);

        console.log('form upload= ', JSON.stringify(form));
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            onUploadProgress: (value: any) => {
                const percent: string = `${(value.loaded / value.total) * 100}`;
                ToastUtils.showMsgToast(`${lbMsg}... ${parseInt(percent, 10)}%`);
            }
        };

        const resUpload: any = await this.api().post(API_CONFIG.UPLOAD_MEDIA, form, config);

        console.log('form = ', JSON.stringify(form));

        if (resUpload?.success) {
            const dataUpload = resUpload?.data;
            if (dataUpload) {
                return { success: true, data: dataUpload };
            }
            ToastUtils.showErrorToast(Languages.image.uploadFailed);
            return { success: false, data: null };
        }

        ToastUtils.showErrorToast(Languages.image.uploadFailed);
        return { success: false, data: null };

    };
}

