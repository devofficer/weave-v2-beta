import { useEffect } from "react";
import { useTokenStateManager } from "state/tokens/hooks";
import { getTokensCoinGecko } from "utils/apis";
import { ChainId } from "utils/chains";
import { trpc } from "utils/trpc";
import { useWeb3React } from "./useWeb3React";

export const useTokensPrice = () => {
  // const { chainId } = useWeb3React()
  const { allTokens } = useTokenStateManager()
  // const chainID = !chainId ? ChainId.BSC : (chainId === ChainId.WEAVE_TESTNET ? ChainId.BSC : chainId)
  // const { data } = trpc.useQuery(['tokens.getByChainId', chainID])

  useEffect(() => {
    const fetchPrice = async () => {
      if (allTokens.length !== 0) {
        const tokenList = await getTokensCoinGecko()

        //  tokenList.map(() => {

        //  })

        // Use map to get a simple array of "val" values. Ex: [1,4]
        let yFilter = allTokens.map(token => { return token.symbol.toLowerCase(); });
        console.log('yFilter', yFilter);

        // Use filter and "not" includes to filter the full dataset by the filter dataset's val.
        let filteredX = tokenList.filter(token => yFilter.includes(token.symbol));

        // Print the result.
        console.log('filteredX', filteredX);
      }
    }
    fetchPrice()
  }, [allTokens])
}