import dynamic from 'next/dynamic'
import { Flex, StackDivider, Text, VStack } from '@chakra-ui/react'
const ColorModeSwitcher = dynamic(() => import('components/common/ColorModeSwitcher'));

const Setting = () => {
  return (
    <Flex>
      <VStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={1}
        align='stretch'
        w={'100%'}
      >
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
          p={2}
          rounded={4}
        >
          <Text fontSize={'md'} fontWeight={600}>Dark Mode</Text>
          <ColorModeSwitcher />
        </Flex>
      </VStack>
    </Flex>
  )
}

export default Setting;