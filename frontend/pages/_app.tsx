import React from 'react';
import type { AppProps } from 'next/app'

import { ChakraProvider } from "@chakra-ui/react";

import {DappkitProviderCtx, defaulDappkitProvider} from '../context';
import ChakraTheme from "../theme";


function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <ChakraProvider theme={ChakraTheme}>
      <DappkitProviderCtx.Provider value={defaulDappkitProvider}>
          <Component {...pageProps} />
      </DappkitProviderCtx.Provider>
    </ChakraProvider>
  );
}

export default MyApp
