import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

const CanvasDepositItem = () => {
  return (
    <Box
      px={10}
      py={4}
      bg={useColorModeValue('gray.600', 'whiteAlpha.50')}
      color="white"
      borderWidth={1}
      borderRadius={10}>
      <Heading as="h3" size={'md'} fontWeight={600} >Contract</Heading>
    </Box>
  )
}

export default CanvasDepositItem;