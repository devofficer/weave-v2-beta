import { Flex, StackDivider, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { INotificationProps } from 'types';

const Notification = ({ items, ...rest }: INotificationProps) => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.200')
  return (
    <Flex>
      <VStack
        divider={<StackDivider borderColor={useColorModeValue('gray.200', 'gray.700')} />}
        spacing={1}
        align='stretch'
        w={'100%'}
      >
        {items.map((item, index) => (
          <Flex
            key={index}
            flexDirection={'column'}
            gap={1}
            cursor={"pointer"}
            p={2}
            rounded={4}
            _hover={{
              bg: bgColor
            }}
            {...rest}>
            <Text fontSize={'sm'} fontWeight={600}>{item.title}</Text>
            <Text fontSize={'xs'}>{item.description}</Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  )
}

export default Notification;