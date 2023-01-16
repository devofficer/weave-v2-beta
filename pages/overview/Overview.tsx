import type { NextPage } from 'next';
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Flex,
  IconButton,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiList, FiGrid, FiSearch } from "react-icons/fi";
import { ethers } from 'ethers';
import { trpc } from 'utils/trpc'
import { useProfileInfoManager } from 'state/user/hooks';
import { useMediaQuery } from 'hooks/useMediaQuery';
import useDebounce from 'hooks/useDebounce';
import { OverviewSortNFilterType, Tvl } from 'types';
import { createFilterStrategies, useSortedStrategiesByQuery, initialSortFilterOption } from 'components/overview/filtering';
import { optionOverview } from 'config/sort_filter_options';
import Tabs, { Tab, TabList, TabPanels, TabPanel } from 'components/common/Tabs';
import { useWeb3React } from 'hooks/useWeb3React';
import { useStrategyStateManager } from 'state/strategy/hooks';
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import MasterchefABI from "config/ABI/Masterchef.json";
import LPPairABI from "config/ABI/LPPairABI.json";
import { Node } from "reactflow";
import { formatEther } from "utils/formatBalance";
import { BABY_TOKEN, BUSD_TOKEN, KNIGHT_TOKEN } from "config/tokens";
import { getTokenPrice } from "utils/apis";
import { ChainId } from 'utils/chains';
const Home = dynamic(() => import('components/layout/Home'))
const Input = dynamic(() => import('components/common/Input'))
const StrategySwiper = dynamic(() => import('components/overview/StrategySwiper'))
const StrategyList = dynamic(() => import('components/overview/StrategyList'))
const SortNFilter = dynamic(() => import('components/common/SortNFilter'))

type TabData = {
  label: string;
  value: number
}

const Overview: NextPage = () => {
  const tabPanelBg = useColorModeValue('white', 'dark.800')
  const iconColor = useColorModeValue('gray.500', 'white')
  const activeColor = useColorModeValue('gray.100', 'whiteAlpha.100')
  const { isExtraDesktop, isLargeDesktop } = useMediaQuery()
  const cardPadding = isExtraDesktop ? 20 : isLargeDesktop ? 5 : 2

  const [active, setActive] = useState(2)
  const [sortFilterOption, setSortFilterOption] = useState<OverviewSortNFilterType>(initialSortFilterOption)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const { signer } = useWeb3React();
  const { user } = useProfileInfoManager()
  const { setTVLPreference, setIsLoadingPreference } = useStrategyStateManager()
  const chainID = user?.chain?.id ? user?.chain?.id : ChainId.BSC

  const { data, isLoading, isFetched } = trpc.useQuery(['strategies.getByUserAddress', { address: user?.address, chainId: chainID }])

  const tabs: TabData[] = [
    { label: "Draft", value: 0 },
    { label: "Live", value: 1 },
    { label: "Copied", value: 2 },
    { label: "Shared", value: 3 },
    { label: "Others", value: 4 }
  ]

  //Search, Sort, Filter Farms
  const filteredStrategies: any = useMemo(() => {
    const filterFarm = createFilterStrategies(debouncedQuery)
    return data?.filter(filterFarm)
  }, [data, debouncedQuery])

  const filteredQueryStrategies = useSortedStrategiesByQuery(filteredStrategies, debouncedQuery, sortFilterOption)
  const filteredSortedStrategies: any = useMemo(() => filteredQueryStrategies, [filteredQueryStrategies])
  const getTVLs = async (strategies: any) => {
    if (!strategies || !signer) {
      return
    }

    const tvlArray: Tvl[] = []
    setIsLoadingPreference(true)
    const babyPrice = await getTokenPrice(BABY_TOKEN, 'bsc')
    const knightPrice = await getTokenPrice(KNIGHT_TOKEN, 'bsc')
    console.log(babyPrice, knightPrice)

    for (let index = 0; index < strategies.length; index++) {
      const data = strategies[index];
      const allTokensInStrategy: any = [];
      let allFundsAmountInStrategy = 0;
      allTokensInStrategy.push(BABY_TOKEN);
      allTokensInStrategy.push(KNIGHT_TOKEN);

      if (data.status === 0) {
        tvlArray.push({
          id: data.id,
          tvl: 0
        })
      } else {

        const strategyContract = new ethers.Contract(
          data.contractAddress,
          strategyArtifactBNB.abi,
          signer
        );

        const tokenDepositedLength = await strategyContract.tokenDepositedLength();
        for (let i = 0; i < tokenDepositedLength; i++) {
          const tokenDepostied = await strategyContract.tokenDeposited(i);
          if (!allTokensInStrategy.includes(tokenDepostied)) {
            allTokensInStrategy.push(tokenDepostied);
          }
        }

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

        const nodes = JSON.parse(data.strategyData).nodes;
        console.log('nodes', nodes)
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
                const userInfo = await masterContractBaby.userInfo(
                  node.data.poolID,
                  data.contractAddress
                );
                const lpAmount = formatEther(userInfo["amount"]);
                console.log('lpAmount', lpAmount)
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
              } catch (error) {
                console.log(error)
              }
            }
            else if (node.data.protocol == "Knight") {
              try {
                const result = await masterContractKnight.poolInfo(
                  node.data.poolID
                );
                const userInfo = await masterContractKnight.userInfo(
                  node.data.poolID,
                  data.contractAddress
                );
                const lpAmount = formatEther(userInfo["amount"]);
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

              } catch (error) {
                console.log(error)
              }
            }
          }
        }

        tvlArray.push({
          id: data.id,
          tvl: allFundsAmountInStrategy
        })
      }
    }
    setTVLPreference(tvlArray)
    setIsLoadingPreference(false)
    console.log('tvlArray', tvlArray)
  }

  const handleSortNFilterOption = (key: string, value: any) => {
    setSortFilterOption({ ...sortFilterOption, [key]: value })
  }
  const handleSearchQueryChange = useCallback((event: any) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  useEffect(() => {
    if (isFetched) {
      getTVLs(data)
    }
  }, [isFetched, data])

  return (
    <Home title="Weave Finanial | Strategy Overview" active='overview'>
      <Flex w="full" h="full" alignItems={{ base: 'start', md: 'center' }} justifyContent={'center'} position="relative">
        {isLoading &&
          <Flex
            flexDirection={'column'}
            justifyContent={'space-between'}
            py={3}
            gap={3}
            w="full"
            minH={'calc(100vh - 200px)'}
            borderRadius={'xl'}>
            <Flex gap={3}>
              <Skeleton w={'full'} h={10} rounded={'xl'} />
            </Flex>
            <Flex bg={tabPanelBg} flexDirection={'column'} gap={10} px={{ base: 5, md: 5 }} py={3} mt="1rem" borderRadius={'xl'} justifyContent={'center'} h="full">
              <Flex gap={10} width="full">
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
              </Flex>
              <Flex gap={10} width="full">
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
                <Skeleton w={'full'} h={72} rounded={'lg'} />
              </Flex>
            </Flex>
          </Flex>
        }
        {!isLoading &&
          <Tabs width={'full'} defaultIndex={0} isLazy isFitted>
            <TabList>
              <Flex bg={tabPanelBg} borderRadius="xl">
                {tabs.map((tab, i) => (
                  <Tab key={i}>{tab.label}</Tab>
                ))}
              </Flex>
              <Flex justifyContent={'flex-end'} gap={4}>
                <Flex flexDirection={'row'} gap={1}>
                  <Input
                    bg={tabPanelBg}
                    borderRadius={'lg'}
                    leftIcon={<FiSearch />}
                    value={searchQuery}
                    handleChange={handleSearchQueryChange}
                  />
                  <SortNFilter
                    borderRadius={'lg'}
                    borderWidth={1}
                    option={optionOverview}
                    value={sortFilterOption}
                    handleOption={handleSortNFilterOption}
                  />
                </Flex>
                <Flex right={0} borderWidth={1} borderRadius={8}>
                  <IconButton
                    size={{ base: 'md', md: 'md' }}
                    variant='ghost'
                    borderRightRadius={0}
                    color={iconColor}
                    aria-label='List Button'
                    fontSize={16}
                    bg={active === 1 ? activeColor : ''}
                    onClick={() => setActive(1)}
                    icon={<FiList />}
                  />
                  <IconButton
                    size={{ base: 'md', md: 'md' }}
                    variant='ghost'
                    borderLeftRadius={0}
                    color={iconColor}
                    aria-label='Grid Button'
                    fontSize={16}
                    bg={active === 2 ? activeColor : ''}
                    onClick={() => setActive(2)}
                    icon={<FiGrid />}
                  />
                </Flex>
              </Flex>
            </TabList>
            <TabPanels>
              {tabs.map((tab, i) => (
                <TabPanel key={i} pb={2}>
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    bg={tabPanelBg}
                    px={{ base: 5, md: active === 1 ? 5 : cardPadding }}
                    py={3}
                    minH={'calc(100vh - 200px)'}
                    borderRadius={'xl'}>
                    {(active === 2) &&
                      <StrategySwiper data={filteredSortedStrategies?.filter((e: any) => e.status === tab.value)} />
                    }
                    {active === 1 &&
                      <StrategyList data={filteredSortedStrategies?.filter((e: any) => e.status === tab.value)} />
                    }
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        }
      </Flex>
    </Home >
  );
};

export default Overview;
