import { LPFARM_ASSETS_BASE_URL } from "config/constants";
import { IFarm } from "types";
import { ChainId } from "utils/chains";
import { useWeb3React } from "./useWeb3React";
import { useEffect } from "react";
import { trpc } from "utils/trpc";
import { getProtocolInfo } from "utils";
import { useLPFarmStateManager } from "state/lpFarms/hooks";

const filteredFarm = (farm: any) => {
  const iconName1 = farm["token1Symbol"] ? farm["token1Symbol"].toLowerCase() : '-';
  const iconName2 = farm["token2Symbol"] ? farm["token2Symbol"].toLowerCase() : '-';

  const farmObj: IFarm = {
    name: `${farm["token1Symbol"]}${farm["token2Symbol"] ? '-' + farm["token2Symbol"] : ''}`,
    icons: [
      `${LPFARM_ASSETS_BASE_URL}/${farm["project"]}/${iconName1}.png`,
      `${LPFARM_ASSETS_BASE_URL}/${farm["project"]}/${iconName2}.png`,
    ],
    poolID: farm["poolId"],
    protocol: farm["project"],
    tvl: farm?.tvl ?? '0',
    apr: farm?.apr ?? '0',
    farmType: farm["type"],
    protocolInfo: getProtocolInfo(farm["project"])
  }

  return farmObj;
}

export const useLPFarms = () => {
  const { chainId } = useWeb3React()
  const { setSavedLPFarmsPreference } = useLPFarmStateManager()
  const chainID = !chainId ? ChainId.BSC : (chainId === ChainId.WEAVE_TESTNET ? ChainId.BSC : chainId)
  const { data } = trpc.useQuery(['farms.getLPByChainId', chainID])

  useEffect(() => {
    const getLpFarms = () => {
      if (!chainID) {
        return
      }
      if (data) {
        const farms = data.map((entry: any) => filteredFarm(entry))
        setSavedLPFarmsPreference(farms)
      }
    }
    getLpFarms()
  }, [data, chainId])
}
