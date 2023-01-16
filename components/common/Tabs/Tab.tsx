import { Tab as ChakraTab, TabProps, useColorModeValue } from '@chakra-ui/react'

interface ITabProps extends TabProps {
  children: any
}

const Tab = ({ children, ...rest }: ITabProps) => {
  return (
    <ChakraTab
      borderRadius={'xl'}
      borderColor="transparent"
      bg={useColorModeValue('white', 'dark.800')}
      fontSize={{ base: 'md', md: 'xl' }}
      fontWeight={600}
      px={{ base: 0, md: 8 }}
      py={1}
      color={useColorModeValue('gray.500', 'white')}
      _selected={{ color: 'white', bg: 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)' }}
      _focusVisible={{
        boxShadow: 'none'
      }}
      {...rest}
    >
      {children}
    </ChakraTab>
  )
}
export default Tab;