import dynamic from 'next/dynamic';
import { Flex, Heading, Text, useColorModeValue, Tag, useDisclosure, Box, Skeleton } from '@chakra-ui/react'
import { IStrategyCardProps } from 'types';
import { getAPY, riskColor, statusText } from 'utils'
import { useStrategyStateManager } from 'state/strategy/hooks';
const Card = dynamic(() => import('components/common/Card'))
const Drawer = dynamic(() => import('components/common/Drawer'))
const Rewards = dynamic(() => import('./Rewards'))
const Popularity = dynamic(() => import('./Popularity'))
const Network = dynamic(() => import('./Network'))
const StrategyPreview = dynamic(() => import('./StrategyPreview'))

const StrategyCardHeader = ({ title }: { title: string }) => {
  return (
    <Heading as='h5' size='md' px={2} textOverflow='ellipsis' overflow={'hidden'} whiteSpace={'nowrap'} color={useColorModeValue('light.800', 'white')} textAlign="center" w="full">
      {title}
    </Heading >
  )
}

const StrategyCardBody = ({ data }: { data: any }) => {
  const { tvls, isLoading } = useStrategyStateManager()
  const tvl = tvls.find((e) => e.id === data.id)?.tvl;

  return (
    <Flex w="full" flexDirection={'column'} >
      <Flex w="full" bg={useColorModeValue('light.800', 'dark.900')} color="white" px={4} pt={4} pb={2} flexDirection="column">
        <Flex justifyContent={'center'}>
          <Heading as='h2' size={{ base: '2xl', md: 'xl', lg: '2xl', xl: '2xl' }} overflow='hidden' whiteSpace='nowrap'>
            {getAPY(JSON.parse(data.strategyData).nodes).toFixed(2)}%
          </Heading>
        </Flex>
        <Heading as='h6' size='xs'>
          APY
        </Heading>
      </Flex>
      <Flex w="full" bg={useColorModeValue('light.400', 'dark.800')} color="white" px={4} py={3} gap={4} flexDirection="column">
        <Flex
          flexDirection={{ base: 'row', md: 'column', lg: 'row', xl: 'row' }}
          alignItems="center"
          gap={1}
          justifyContent={{ base: 'space-between', md: 'center', lg: 'space-between' }}>
          <Flex gap={2} alignItems={'center'} >
            <Heading as='h4' size={{ base: 'md', md: 'sm', lg: 'sm', xl: 'md' }} color={useColorModeValue('light.800', 'white')}>
              TVL
            </Heading>
            {isLoading ? (
              <Skeleton width={12} height={6} rounded="md" />
            ) : (
              <Heading as='h4' size={{ base: 'md', md: 'sm', lg: 'sm', xl: 'md' }} overflow='hidden' whiteSpace='nowrap' color={'white'}>
                {tvl ? tvl.toFixed(2) : '0.00'}$
              </Heading>
            )}
          </Flex>
          {/* <Flex gap={2} alignItems={'center'} >
            <Heading as='h4' size={{ base: 'md', md: 'sm', lg: 'sm', xl: 'md' }} color={useColorModeValue('light.800', 'white')}>
              RISK
            </Heading>
            <Tag size={'md'} borderRadius="full" variant='solid' bg={useColorModeValue('gray.50', "whiteAlpha.100")} color={riskColor(data.risk)} lineHeight={'1px'}>{data.risk}</Tag>
          </Flex> */}
        </Flex>

        <Flex
          flexDirection={{ base: 'row', md: 'column', lg: 'row', xl: 'row' }}
          alignItems="center"
          gap={1}
          justifyContent={{ base: 'space-between', md: 'center', lg: 'space-between' }}>
          <Flex bg={useColorModeValue('light.700', 'dark.900')} p={2} borderRadius="lg">
            <Rewards />
          </Flex>
          <Flex >
            <Popularity rate={data.popularity} isWithLabel />
          </Flex>
        </Flex>
      </Flex>
    </Flex >
  )
}

const StrategyCardFooter = ({ data }: { data: any }) => {
  return (
    <Flex justifyContent={'space-between'} px={4}>
      <Network chainId={data.chainId} isWithLabel={true} width={24} height={24} />
      <Box display="none">{data.title}</Box>
      <Flex gap={2}>
        <Text fontSize='md' fontWeight={600} textTransform="uppercase" color={'green.600'}>
          {statusText(data.status)}
        </Text>
        <Tag size={'md'} borderRadius="full" variant='solid' colorScheme='green' lineHeight={'1px'}>@Weavy</Tag>
      </Flex>
    </Flex>
  )
}

const StrategyCard = ({ data }: IStrategyCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex w={'full'} mb={5} onClick={onOpen} cursor="pointer" className="swiper-lazy">
        <Card
          bg={useColorModeValue('secGray.300', 'dark.700')}
          p={0}
          borderWidth={1}
          borderColor={useColorModeValue('secGray.300', 'dark.700')}
          header={<StrategyCardHeader title={data.name} />}
          body={<StrategyCardBody data={data} />}
          footer={<StrategyCardFooter data={data} />}
        />
      </Flex>
      <Drawer isOverlay={true} isOpen={isOpen} placement='right' size="xl" onClose={onClose}>
        <StrategyPreview data={data} />
      </Drawer>
    </>
  )
}

export default StrategyCard;