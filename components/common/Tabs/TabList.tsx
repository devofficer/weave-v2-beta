import { Flex, TabList as ChakraTabList, TabListProps } from '@chakra-ui/react'

interface ITabListProps extends TabListProps {
  children: any
}

const TabList = ({ children, ...rest }: ITabListProps) => {
  return (
    <Flex justifyContent={'center'}>
      <ChakraTabList
        width={'100%'}
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent={'space-between'}
        gap={2}
        {...rest}
      >
        {children}
      </ChakraTabList>
    </Flex>
  )
}
export default TabList;