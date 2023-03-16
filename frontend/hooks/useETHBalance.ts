import { useContext, useCallback } from "react";
import { DappkitProviderCtx } from "../context";
import useAsync from "./useAsync";
import { fromWei } from "web3-utils";

/**
 * Get Ethereum Balance
 * @returns
 */
const useETHBalance = (): {
  loading: boolean;
  error: string | null;
  balance: string;
} => {
  const proxy = useContext(DappkitProviderCtx);

  // Execute Async Call
  const executeFunc = useCallback(async () => {
    return proxy.getConnection().getBalance();
  }, []);

  const { loading, error, result } = useAsync(executeFunc, true);
  // Numeric Conversion
  const weiBalance = result ? fromWei(result) : "";

  return { error, loading, balance: weiBalance };
};

export default useETHBalance;
