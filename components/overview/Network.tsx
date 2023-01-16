import dynamic from 'next/dynamic';
import { Flex, Heading } from '@chakra-ui/react'
const Image = dynamic(() => import('components/common/Image'))
import { useWallet } from 'hooks/useWallet'

interface INetworkProps {
  chainId: number;
  isWithLabel: boolean;
  width?: number;
  height?: number;
}

const Network = ({ chainId, isWithLabel, width = 32, height = 32 }: INetworkProps) => {
  const { getIconOfChain, getColorOfChain, getNameOfChain } = useWallet()
  return (
    <Flex alignItems={'center'} gap={1}>
      <Image
        width={width}
        height={height}
        borderRadius='full'
        src={getIconOfChain(chainId)}
        alt='network'
      />
      {isWithLabel &&
        <Heading as="h4" size={'sm'} color={getColorOfChain(chainId)} textTransform="uppercase" display={{ base: 'block', md: 'none', xl: 'block' }} textOverflow='ellipsis' overflow={'hidden'} whiteSpace={'nowrap'}>
          {getNameOfChain(chainId)}
        </Heading>
      }
    </Flex>
  )
}

export default Network;