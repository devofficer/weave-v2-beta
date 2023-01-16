import dynamic from "next/dynamic";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
const SwapBoxItem = dynamic(() => import('./SwapBoxItem'));

const SwapBox = () => {
  return (
    <Box>
      <Flex gap={2} alignItems="center" mb={3}>
        <Divider />
        <Heading as='h6' size={'md'}>Swap</Heading>
        <Divider />
      </Flex>
      <SwapBoxItem />
    </Box>
  )
}

export default SwapBox;