import { action, makeObservable, observable } from 'mobx';

import { UserInfoModal } from '@/models/user-models';
import SessionManager from './SessionManager';

export class UserManager {
    @observable userInfo?: UserInfoModal = SessionManager.userInfo;

    @observable phoneNumber?: string = SessionManager.userInfo?.phone_number;

    constructor() {
        makeObservable(this);
    }

    @action updateUserInfo(userInfo?: UserInfoModal) {
        this.userInfo = userInfo;
        this.phoneNumber = userInfo?.phone_number;

        SessionManager.setUserInfo(userInfo);
    }
}
