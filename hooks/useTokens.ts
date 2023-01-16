import { useEffect } from "react";
import { useTokenStateManager } from "state/tokens/hooks";
import { ChainId } from "utils/chains";
import { trpc } from "utils/trpc";
import { useWeb3React } from "./useWeb3React";

export const useAllTokens = () => {
  const { chainId } = useWeb3React()
  const { setTokensPreference } = useTokenStateManager()
  const chainID = !chainId ? ChainId.BSC : (chainId === ChainId.WEAVE_TESTNET ? ChainId.BSC : chainId)
  const { data } = trpc.useQuery(['tokens.getByChainId', chainID])

  useEffect(() => {
    const getTokens = () => {
      if (!chainID) {
        return
      }
      if (data) {
        data.forEach(function (v) {
          delete v.id;
          delete v.createdAt;
          delete v.updatedAt;
        });
        setTokensPreference(data)
      }
    }
    getTokens()
  }, [data, chainId])
}