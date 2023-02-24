import { createContext } from 'react';

import AppStoreType from './appStore';

export const AppStoreContext = createContext<AppStoreType | null>(null);


