import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "./useWeb3React";
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import MasterchefABI from "config/ABI/Masterchef.json";
import LPPairABI from "config/ABI/LPPairABI.json";
import { Node } from "reactflow";
import { formatEther } from "utils/formatBalance";
import { BABY_TOKEN, BUSD_TOKEN, KNIGHT_TOKEN, WBNB_TOKEN } from "config/tokens";
import { getTokenPrice } from "utils/apis";
import { IClaimableData, ILpData, Tvl } from "types";
import { useTokenStateManager } from "state/tokens/hooks";

export const useGetAllFundsInStrategy = (initData: any) => {
  const { allTokens } = useTokenStateManager()
  const { signer } = useWeb3React();
  const [tvl, setTVL] = useState(0);
  const [lpData, setLpData] = useState<ILpData[]>([]);
  const [claimData, setClaimData] = useState<IClaimableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllFundsInStrategy = useCallback(async (data: any) => {
    const allTokensInStrategy: any = [];
    let allFundsAmountInStrategy = 0;
    allTokensInStrategy.push(BABY_TOKEN);
    allTokensInStrategy.push(KNIGHT_TOKEN);

    if (!data || !signer) {
      return
    }
    if (data.status === 0) {
      setTVL(0)
    } else {
      setIsLoading(true)
      console.log('data')
      const strategyContract = new ethers.Contract(
        data.contractAddress,
        strategyArtifactBNB.abi,
        signer
      );
      const tokenDepositedLength = await strategyContract.tokenDepositedLength();
      for (let index = 0; index < tokenDepositedLength; index++) {
        const tokenDepostied = await strategyContract.tokenDeposited(index);
        if (!allTokensInStrategy.includes(tokenDepostied)) {
          allTokensInStrategy.push(tokenDepostied);
        }
      }
      const babyPrice = await getTokenPrice(BABY_TOKEN, 'bsc')
      const knightPrice = await getTokenPrice(KNIGHT_TOKEN, 'bsc')

      // const factoryContractBaby = new ethers.Contract(
      //   "0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da",
      //   FactoryABI,
      //   signer
      // );
      // const factoryContractKnight = new ethers.Contract(
      //   "0xf0bc2E21a76513aa7CC2730C7A1D6deE0790751f",
      //   FactoryABI,
      //   signer
      // );

      const masterContractBaby = new ethers.Contract(
        "0xdfAa0e08e357dB0153927C7EaBB492d1F60aC730",
        MasterchefABI,
        signer
      );

      const masterContractKnight = new ethers.Contract(
        "0xE50cb76A71b0c52Ab091860cD61b9BA2FA407414",
        MasterchefABI,
        signer
      );

      const lpDataInContract: ILpData[] = [];
      const nodes = JSON.parse(data.strategyData).nodes;
      for (let index = 0; index < nodes.length; index++) {
        const node: Node = nodes[index];
        if (node.type == "swap") {
          if (!allTokensInStrategy.includes(node.data.tokenAddresses)) {
            allTokensInStrategy.push(node.data.tokenAddresses);
          }
        }
        if (node.type == "item") {
          if (node.data.protocol == "Baby") {
            try {
              const result = await masterContractBaby.poolInfo(
                node.data.poolID
              );
              let lpAmount = await masterContractBaby.userInfo(
                node.data.poolID,
                data.contractAddress
              );
              lpAmount = formatEther(lpAmount["amount"]);
              let pendingAmount = await masterContractBaby.pendingCake(
                node.data.poolID,
                data.contractAddress
              );
              pendingAmount = formatEther(pendingAmount["_hex"]);
              console.log("pendingAmount", pendingAmount);
              const lpContract = new ethers.Contract(
                result["lpToken"],
                LPPairABI,
                signer
              );
              const token1 = await lpContract.token0();
              const token2 = await lpContract.token1();

              const reserves = await lpContract.getReserves();
              const reserve1 = formatEther(
                reserves["_reserve0"]["_hex"]
              );
              const reserve2 = formatEther(
                reserves["_reserve1"]["_hex"]
              );
              const totalSupply = await lpContract.totalSupply();

              const token1Price = token1 != BUSD_TOKEN ? await getTokenPrice(token1, 'bsc') : 1
              const token2Price = token1 != BUSD_TOKEN ? await getTokenPrice(token2, 'bsc') : 1

              const totalLPValue = Number(reserve1) * Number(token1Price) + Number(reserve2) * Number(token2Price);
              const lpValue = totalLPValue / Number(formatEther(totalSupply));

              if (!allTokensInStrategy.includes(token1)) {
                allTokensInStrategy.push(token1);
              }
              if (!allTokensInStrategy.includes(token2)) {
                allTokensInStrategy.push(token2);
              }
              allFundsAmountInStrategy += Number(lpAmount) * lpValue;
              allFundsAmountInStrategy += Number(pendingAmount) * Number(babyPrice);

              const lpData: ILpData = {
                protocol: "Baby",
                poolId: node.data.poolID,
                lpAddress: result["lpToken"],
                token1: token1,
                token2: token2,
                name: node.data.name,
                icons: node.data.icons,
                amount: lpAmount,
                value: Number(lpAmount) * lpValue,
                rewardsPending: pendingAmount,
                rewardPendingValue: Number(pendingAmount) * Number(babyPrice),
              };
              lpDataInContract.push(lpData);
            } catch (error) {
              console.log(error)
            }
          } else if (node.data.protocol == "Knight") {
            try {
              const result = await masterContractKnight.poolInfo(
                node.data.poolID
              );
              let lpAmount = await masterContractKnight.userInfo(
                node.data.poolID,
                data.contractAddress
              );
              lpAmount = formatEther(lpAmount["amount"]);
              let pendingAmount = await masterContractKnight.pendingKnight(
                node.data.poolID,
                data.contractAddress
              );
              pendingAmount = formatEther(pendingAmount["_hex"]);
              const lpContract = new ethers.Contract(
                result["lpToken"],
                LPPairABI,
                signer
              );
              const token1 = await lpContract.token0();
              const token2 = await lpContract.token1();

              const reserves = await lpContract.getReserves();
              const reserve1 = formatEther(
                reserves["_reserve0"]["_hex"]
              );
              const reserve2 = formatEther(
                reserves["_reserve1"]["_hex"]
              );
              const totalSupply = await lpContract.totalSupply();

              const token1Price = token1 != BUSD_TOKEN ? await getTokenPrice(token1, 'bsc') : 1
              const token2Price = token1 != BUSD_TOKEN ? await getTokenPrice(token2, 'bsc') : 1

              const totalLPValue = Number(reserve1) * Number(token1Price) + Number(reserve2) * Number(token2Price);
              const lpValue = totalLPValue / Number(formatEther(totalSupply));

              if (!allTokensInStrategy.includes(token1)) {
                allTokensInStrategy.push(token1);
              }
              if (!allTokensInStrategy.includes(token2)) {
                allTokensInStrategy.push(token2);
              }

              allFundsAmountInStrategy += Number(lpAmount) * lpValue;
              allFundsAmountInStrategy += Number(pendingAmount) * Number(knightPrice);

              const lpData: ILpData = {
                protocol: "Knight",
                poolId: node.data.poolID,
                lpAddress: result["lpToken"],
                token1: token1,
                token2: token2,
                name: node.data.name,
                icons: node.data.icons,
                amount: lpAmount,
                value: Number(lpAmount) * lpValue,
                rewardsPending: pendingAmount,
                rewardPendingValue: Number(pendingAmount) * Number(knightPrice),
              };
              lpDataInContract.push(lpData);
            } catch (error) { }
          }
        }
      }

      console.log("lpDataInContract", lpDataInContract);
      console.log('allFundsAmountInStrategy', allFundsAmountInStrategy)
      setLpData(lpDataInContract);
      const claimableData: IClaimableData[] = [];

      for (let index = 0; index < allTokensInStrategy.length; index++) {
        const token: string = allTokensInStrategy[index];

        const tokenContract = new ethers.Contract(token, LPPairABI, signer);
        let tokenAmount = await tokenContract.balanceOf(data?.contractAddress);
        tokenAmount = formatEther(tokenAmount["_hex"]);
        const tokenName = await tokenContract.symbol();
        const tokenLogoURI = allTokens.find((e: any) => e.address === token)?.logoURI

        const rewardTokenValue = await getTokenPrice(token, 'bsc')
        console.log(Number(tokenAmount) * Number(rewardTokenValue))
        allFundsAmountInStrategy += Number(tokenAmount) * Number(rewardTokenValue);
        setTVL(allFundsAmountInStrategy);
        const claimableDataTemp: IClaimableData = {
          amount: tokenAmount,
          name: tokenName,
          logoURI: tokenLogoURI,
          address: token,
        };

        if (tokenAmount > 0) {
          claimableData.push(claimableDataTemp);
        }
      }

      setClaimData(claimableData);
      console.log("claimableData", claimableData);
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (allTokens.length !== 0) {
      getAllFundsInStrategy(initData)
    }
  }, [allTokens])

  return {
    tvl,
    lpData,
    claimData,
    isLoading,
    getAllFundsInStrategy
  }
}
