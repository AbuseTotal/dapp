import { useContext } from "react";
import { DappkitProviderCtx } from "../context";
import useAsync from "./useAsync";

const useAddress = (): {
  loading: boolean;
  error: string | null;
  address: string | null;
} => {
  const dappkitProvider = useContext(DappkitProviderCtx);

  const execute = async () => {
    return dappkitProvider.getAddress();
  };

  const { loading, error, result } = useAsync(execute);

  return { loading, address: result, error };
};

export default useAddress;
