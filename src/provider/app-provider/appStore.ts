import { makeObservable, observable } from 'mobx';

import { ApiServices } from '../../api/index';
import { AppManager } from '@/manager/AppManager';
import { FastAuthInfo as FastAuthInfoManager } from '@/manager/FastAuthInfoManager';
import { UserManager } from '@/manager/UserManager';
import { Common } from '@/manager/Common';
import { NotificationManager } from '@/manager/NotificationManager';
import { NetworkManager } from '@/manager/NetworkManager';

class AppStore {
    @observable fastAuthInfoManager = new FastAuthInfoManager();

    @observable appManager = new AppManager();

    apiServices = new ApiServices();

    @observable userManager = new UserManager();

    @observable networkManager = new NetworkManager();

    @observable notificationManager = new NotificationManager();

    @observable common = new Common();

    constructor() {
        makeObservable(this);
    }

}

export type AppStoreType = AppStore;
export default AppStore;
