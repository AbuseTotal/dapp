import { useEffect, useState, useContext } from "react";
import { DappkitProviderCtx } from "../context";
import { IDappkitReactProvider } from "../lib/IDappkitReactProvider";

export const useWeb3 = () => {
  const dappkitProvider: IDappkitReactProvider = useContext(DappkitProviderCtx);
  const [connected, setConnected] = useState(dappkitProvider.isConnected());
  const address = dappkitProvider.getAddress();
  const chainId = dappkitProvider.getChainId();
  const [error, setError] = useState("");

  const reactor = {
    onConnectionEvent: () => {
      setConnected(true);
    },
    onDisconnectEvent: () => {
      setConnected(false);
    },
    onError: (e: Error) => {
      console.error(e);
      setError(e.message);
    },
  };

  useEffect(() => {
    dappkitProvider.subscribe(reactor);
    return () => {
      dappkitProvider.unsubscribe(reactor);
    };
  }, []);

  return {
    connected,
    connect: () => {
      dappkitProvider.connect();
    },
    disconnect: () => {
      dappkitProvider.disconnect();
    },
    error,
    chainId,
    address,
  };
};
