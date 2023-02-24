import { action, makeObservable, observable } from 'mobx';

export class FastAuthInfo {
    @observable isEnableFastAuth = false;

    @observable supportedBiometry = '';

    @observable isFocusLogin = false;


    constructor() {
        makeObservable(this);
    }

    @action setEnableFastAuthentication(fastAuth: boolean) {
        this.isEnableFastAuth = fastAuth;
    }

    @action setFocusLogin(focus: boolean) {
        this.isFocusLogin = focus;
    }

    @action setSupportedBiometry(isSupported: string) {
        this.supportedBiometry = isSupported;
    }
}
