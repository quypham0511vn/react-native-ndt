import { useContext } from 'react';

import { AppStoreType } from '../provider/app-provider/appStore';
import { AppStoreContext } from '../provider/app-provider/context';

export const useAppStore = () => {
    const payload = useContext<AppStoreType | null>(AppStoreContext);
    if (!payload) {
        throw new Error('useAppStore must be use within AppStoreProvider.');
    }
    return payload;
};
