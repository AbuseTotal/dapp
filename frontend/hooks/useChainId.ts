import { useContext } from "react";
import { DappkitProviderCtx } from "../context";
import useAsync from "./useAsync";

const useChainId = (): {
  chainId: number | null;
  loading: boolean;
  error: string;
} => {
  const dappkitProvider = useContext(DappkitProviderCtx);

  const execute = async () => {
    return dappkitProvider.getConnection().eth.getChainId();
  };

  const { loading, error, result } = useAsync(execute);

  return { error, loading, chainId: result };
};

export default useChainId;
