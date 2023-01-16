import dynamic from 'next/dynamic';
import { Flex, useColorModeValue, Heading, useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { TOAST_OPTOPNS } from 'config';
import { trpc } from 'utils/trpc';
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import MasterchefABI from "config/ABI/Masterchef.json";
import LPPairABI from "config/ABI/LPPairABI.json";
import { BABY_TOKEN, BUSD_TOKEN, KNIGHT_TOKEN } from "config/tokens";
import { Node } from "reactflow";
import { formatEther } from "utils/formatBalance";
import { getTokenPrice } from "utils/apis";
import { useWeb3React } from 'hooks/useWeb3React';
import { deployStrategyContract } from 'hooks/useContract';
import { useTokenStateManager } from 'state/tokens/hooks';
import { IClaimableData, ILpData } from 'types';
import Tabs, { Tab, TabList, TabPanels, TabPanel } from 'components/common/Tabs';
import { ethers } from 'ethers';
const CommentBox = dynamic(() => import('./comments'))
const ColorLabel = dynamic(() => import('components/common/ColorLabel'))
const Card = dynamic(() => import('components/common/Card'))
const Button = dynamic(() => import('components/common/Button'))
const SettingCardBody = dynamic(() => import('./setting'))
const AddDeposit = dynamic(() => import('./setting/AddDeposit'))
const PublishModal = dynamic(() => import('./setting/PublishModal'))
const FundsBox = dynamic(() => import('./funds/FundsBox'))

const StrategyDetailTabs = ({ data, onUpdate, isUpdate }: { data: any, onUpdate: (id: number, status: number) => void, isUpdate: boolean }) => {
  const toast = useToast();
  const { chainId, signer } = useWeb3React();

  const { allTokens } = useTokenStateManager()
  const [tvl, setTVL] = useState(0);
  const [lpData, setLpData] = useState<ILpData[]>([]);
  const [claimData, setClaimData] = useState<IClaimableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [status, setStatus] = useState(data?.status)
  // const { tvl, lpData, claimData, getAllFundsInStrategy } = useGetAllFundsInStrategy(data)

  const updateStrategyMutation = trpc.useMutation(['strategies.update'], {
    onSuccess: (data) => {
      console.log('datasss', data)
      getAllFundsInStrategy(data);
      toast({
        title: 'Success',
        description: 'Strategy is updated correctly.',
        status: 'success',
        ...TOAST_OPTOPNS,
      })
    },
  })

  const updateStrategy = useCallback((preload: any) => {
    updateStrategyMutation.mutate(preload)
    console.log('data', updateStrategyMutation)
    setStatus(updateStrategyMutation?.data?.status)
  }, [updateStrategyMutation])

  const getAllFundsInStrategy = useCallback(async (data: any) => {
    const allTokensInStrategy: any = [];
    let allFundsAmountInStrategy = 0;
    allTokensInStrategy.push(BABY_TOKEN);
    allTokensInStrategy.push(KNIGHT_TOKEN);

    if (!data || !signer) {
      return
    }
    console.log('dddd', data)
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
          if (!allTokensInStrategy.includes(node.data.token.address)) {
            allTokensInStrategy.push(node.data.token.address);
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
            } catch (error) {
              console.log('error', error)
            }
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

  const handleDeployContract = async (id: number) => {
    try {
      if (signer) {
        setActiveButton('deploy')
        setIsLoading(true)
        const contract = await deployStrategyContract(chainId, signer)
        if (contract) {
          toast({
            title: 'Contract Deployment',
            description: 'Your contract deployed successfully',
            status: 'success',
            ...TOAST_OPTOPNS,
          })
          setIsLoading(false)
          const preload: any = {
            id: id,
            status: 1,
            contractAddress: contract?.address,
            updatedAt: new Date()
          }
          updateStrategy(preload)
        }
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (allTokens.length !== 0) {
      getAllFundsInStrategy(data)
    }
  }, [allTokens])

  return (
    <Flex w="full" justifyContent={'center'} position="relative">
      <Tabs w="full" alignItems="center" defaultIndex={0} isFitted isLazy>
        <TabList>
          <Flex bg={useColorModeValue('white', 'dark.800')} borderRadius="xl" w={'full'}>
            <Tab fontSize={{ base: 'md', md: 'lg' }} px={3}>Settings</Tab>
            <Tab fontSize={{ base: 'md', md: 'lg' }} px={3}>Funds</Tab>
            <Tab fontSize={{ base: 'md', md: 'lg' }} px={3}>Comments</Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel pb={2}>
            <Flex flexDirection={'column'} gap={4}>
              <Card
                header={
                  <Flex gap={2} alignItems={'center'}>
                    <ColorLabel color={data?.label} />
                    <Heading as="h4" fontSize={'xl'}>
                      {data?.name}
                    </Heading>
                  </Flex>
                }
                body={<AddDeposit status={status} contractAddress={data?.contractAddress} />}
              />
              <Card body={<SettingCardBody tvl={tvl} />} />

              <Flex width={'full'} flexDirection={"column"} pt={5} gap={4}>
                {status !== 0 &&
                  <PublishModal id={data?.id} status={status} onUpdate={onUpdate} />
                }
                {status === 0 &&
                  <>
                    <Button
                      label={'Deploy'}
                      leftIcon={<FiSave />}
                      onClick={() => handleDeployContract(data?.id)}
                      isLoading={(activeButton === 'deploy' && isLoading) || updateStrategyMutation.isLoading} />
                    <Button
                      label={'Update'}
                      leftIcon={<FiSave />}
                      onClick={() => onUpdate(data?.id, status)}
                      isLoading={isUpdate} />
                  </>
                }
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel pb={2}>
            <FundsBox claimData={claimData} lpData={lpData} contractAddress={data?.contractAddress} />
          </TabPanel>
          <TabPanel pb={2}>
            <CommentBox sId={data?.id} contractAddress={data?.contractAddress} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default StrategyDetailTabs;