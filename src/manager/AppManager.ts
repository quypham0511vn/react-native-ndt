import { action, makeObservable, observable } from 'mobx';

export class AppManager {
    @observable isAppInReview = false;
    @observable isFocused = false;

    constructor() {
        makeObservable(this);
    }

    @action setIsFocus(isFocus: boolean) {
        this.isFocused = isFocus;
    }

    @action setAppInReview(isAppInReview: boolean) {
        this.isAppInReview = isAppInReview;
    }
}
