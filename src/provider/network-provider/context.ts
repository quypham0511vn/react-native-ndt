import { createContext } from 'react';

import { NetInfo } from './type';

export const NetworkContext = createContext<NetInfo>({});
