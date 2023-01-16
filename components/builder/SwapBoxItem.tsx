import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { useStrategyBuilder } from "hooks/useStrategyBuilder";
import dynamic from "next/dynamic";
import { useNetwork } from "wagmi";
const Image = dynamic(() => import('components/common/Image'));

const SwapBoxItem = () => {
  const { getSwapLogo, getSwapName } = useStrategyBuilder()
  const { chain } = useNetwork()
  const onDragStart = (e: any, params: any) => {
    console.log("Swap Node drag Started! poolID: ", params.poolID)
    e.dataTransfer.setData("poolID", params.poolID);
    e.dataTransfer.setData("protocol", params.protocol);
  }
  return (
    <Flex
      p={2}
      borderRadius={'xl'}
      bg={useColorModeValue('secGray.300', 'dark.900')}
      gap={2}
      alignItems="center"
      flexDirection={'column'}
      cursor="grab"
      _hover={{
        bg: useColorModeValue('secGray.400', 'dark.700')
      }}
      draggable
      onDragStart={(e) => {
        onDragStart(e, {
          poolID: 'swap',
          protocol: chain?.id
        })
      }}
    >
      <Image
        width={32}
        height={32}
        src={getSwapLogo()}
        alt={'swap'}
        mr='12px'
      />
      <Heading as='h6' size={'sm'}>{getSwapName()}</Heading>
    </Flex>
  )

}

export default SwapBoxItem;