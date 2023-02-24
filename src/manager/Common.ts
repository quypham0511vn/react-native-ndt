import { AppConfigModel } from '@/models/app-config';
import { action, makeObservable, observable } from 'mobx';

export class Common {
    @observable isFocused = false;

    @observable refresh = false;

    @observable successChangePass = false;

    @observable successGetOTP = false;

    @observable appConfig: AppConfigModel | undefined;

    constructor() {
        makeObservable(this);
    }

    @action setIsFocus(isFocus: boolean) {
        this.isFocused = isFocus;
    }

    @action setRefresh(refresh: boolean) {
        this.refresh = refresh;
    }

    @action setSuccessGetOTP(successGetOTP: boolean) {
        this.successGetOTP = successGetOTP;
    }

    @action setSuccessChangePass(successChangePass: boolean) {
        this.successChangePass = successChangePass;
    }

    @action setAppConfig(appConfig: any) {
        this.appConfig = appConfig;
    }
}
