import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import {DappkitProviderCtx, defaulDappkitProvider} from '../context';

function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <DappkitProviderCtx.Provider value={defaulDappkitProvider}>
        <Component {...pageProps} />
    </DappkitProviderCtx.Provider>
  );
}

export default MyApp
