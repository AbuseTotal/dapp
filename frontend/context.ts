import DappkitReactProvider from "./lib/DappkitReactProvider";
import React from 'react';

import { chainDict } from "./constants/networks";
import { dappConfig } from "./config";

export const defaulDappkitProvider = new DappkitReactProvider(
    dappConfig.chainId,
    chainDict[dappConfig.chainId]?.rpc,
    {
        autonnect: false,
        switchNetwork: true,
        addNewortk: true,
        disconnectOnSwitchAccount: false,
        disconnectOnChangeNetwork: false,
    }
)


export const DappkitProviderCtx = React.createContext(defaulDappkitProvider);

