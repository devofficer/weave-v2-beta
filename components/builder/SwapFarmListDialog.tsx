import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  Tag,
  TagLabel,
  useColorModeValue,
  Image,
} from '@chakra-ui/react'
import dynamic from "next/dynamic";
import { useStrategyBuilder } from 'hooks/useStrategyBuilder';
import { useWeb3React } from 'hooks/useWeb3React';
import { useLPFarmStateManager } from 'state/lpFarms/hooks';
import { useCallback, useMemo, useState } from 'react';
import { BuilderSortNFilterType, IFarm } from 'types';
import { createFilterFarm, initialSortFilterOption, useSortedFarmsByQuery } from 'components/builder/filtering';
import useDebounce from 'hooks/useDebounce';
import { optionBuilder } from 'config/sort_filter_options';
import { FiSearch } from 'react-icons/fi';
const Input = dynamic(() => import('components/common/Input'))
const SortNFilter = dynamic(() => import('components/common/SortNFilter'))


const SwapFarmListDialog = ({ onUpdate }: { onUpdate: (poolID: string, protocol: any) => void }) => {
  const { chainId } = useWeb3React()
  const [sortFilterOption, setSortFilterOption] = useState<BuilderSortNFilterType>(initialSortFilterOption)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { getSwapLogo, getSwapName } = useStrategyBuilder()
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const { lpFarms } = useLPFarmStateManager()
  const debouncedQuery = useDebounce(searchQuery, 200)
  //Search, Sort, Filter Farms
  const filteredFarms: IFarm[] = useMemo(() => {
    const filterFarm = createFilterFarm(debouncedQuery)
    return lpFarms.filter(filterFarm)
  }, [lpFarms, debouncedQuery])

  const filteredQueryFarms = useSortedFarmsByQuery(filteredFarms, debouncedQuery, sortFilterOption)
  const filteredSortedFarms: IFarm[] = useMemo(() => filteredQueryFarms, [filteredQueryFarms])
  const handleSearchQueryChange = useCallback((event: any) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const handleSortNFilterOption = (key: string, value: any) => {
    setSortFilterOption({ ...sortFilterOption, [key]: value })
  }

  return (
    <Flex flexDirection={'column'} gap={3}>
      <Flex flexDirection={'column'} gap={3}>
        <Text w={'full'} pb={2} color={'gray.500'}>Swap Name</Text>
        <Flex gap={2}>
          <Tag
            size='lg'
            colorScheme={useColorModeValue('light', 'dark')}
            borderRadius='full'
            onClick={() => {
              onUpdate('swap', chainId)
            }}>
            <Image
              boxSize={5}
              src={getSwapLogo()}
              alt={'token'}
            />
            <TagLabel px={2}>{getSwapName()}</TagLabel>
          </Tag>
        </Flex>
      </Flex>

      <Flex flexDirection={'column'} gap={3}>
        <Text w={'full'} pb={2} color={'gray.500'}>Farm Name</Text>
        <Flex flexDirection={'row'} gap={1}>
          <Input
            borderRadius={'xl'}
            leftIcon={<FiSearch />}
            value={searchQuery}
            handleChange={handleSearchQueryChange}
          />
          <SortNFilter
            bg={'transparent'}
            borderRadius={'xl'}
            borderWidth={1}
            option={optionBuilder}
            value={sortFilterOption}
            handleOption={handleSortNFilterOption}
          />
        </Flex>
        <Box borderWidth={1} borderRadius={4} height={'400px'} overflow={'auto'}>
          <List spacing={3}>
            {filteredSortedFarms.map((farm, i) => (
              <ListItem
                onClick={() => {
                  onUpdate(farm.poolID, farm.protocol)
                }}
                key={i}
                w="full"
                display={'flex'}
                justifyContent="space-between"
                py={'0.5rem'}
                px={'1rem'}
                alignItems={'center'}
                cursor="pointer"
                _hover={{
                  bg: hoverBg
                }}
              >
                <Flex gap={2} alignItems={'center'} w="full">
                  <Flex w={12}>
                    <Image
                      boxSize={6}
                      src={farm.icons[0]}
                      alt={'token'}
                    />
                    <Image
                      boxSize={6}
                      src={farm.icons[1]}
                      alt={'token'}
                    />
                  </Flex>

                  <Flex flexDirection={'column'}>
                    <Heading as="h5" size={'sm'} >{farm.name}</Heading>
                    <Flex gap={4} >
                      <Text fontSize={'xs'} color={'gray.400'}>TVL &nbsp; {farm.tvl ? farm.tvl : '-'}</Text>
                      <Text fontSize={'xs'} color={'gray.400'}>APR &nbsp; {farm.apr ? farm.apr : '-'}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* <Tabs defaultIndex={0} isLazy>
          <TabList border={'none'} gap={2}>
            {lpFarms.map((item, i) => (
              <Tab
                key={i}
                fontSize={'sm'}
                px={2}
                py={1}
                mb={0}
                borderWidth={1}
                borderRadius={'xl'}
                borderColor={borderColor}
                _selected={{
                  borderWidth: 1,
                  color: 'white',
                  bg: bgColor,
                  borderColor: borderColor
                }}

              >{item.swapName}</Tab>
            ))}
          </TabList>
          <TabPanels >
            {lpFarms.map((item, i) => (
              <TabPanel px={0} key={i}>

              </TabPanel>
            ))}
          </TabPanels>
        </Tabs> */}
      </Flex>
    </Flex >
  )
}

export default SwapFarmListDialog;