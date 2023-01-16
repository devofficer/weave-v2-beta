import { TabPanel as ChakraTabPanel, TabPanelProps } from '@chakra-ui/react'

interface ITabPanelProps extends TabPanelProps {
  children: any
}

const TabPanel = ({ children, ...rest }: ITabPanelProps) => {

  return (
    <ChakraTabPanel px={0} {...rest}>
      {children}
    </ChakraTabPanel>
  )
}

export default TabPanel;