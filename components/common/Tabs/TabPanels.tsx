import { TabPanels as ChakraTabPanels, TabPanelsProps } from '@chakra-ui/react'

interface ITabPanelsProps extends TabPanelsProps {
  children: any
}

const TabPanels = ({ children, ...rest }: ITabPanelsProps) => {

  return (
    <ChakraTabPanels {...rest}>
      {children}
    </ChakraTabPanels>
  )
}

export default TabPanels;