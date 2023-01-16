import { Tabs as ChakraTabs, TabsProps } from '@chakra-ui/react'

interface ITabsProps extends TabsProps {
  children: any
}

const Tabs = ({ children, ...rest }: ITabsProps) => {

  return (
    <ChakraTabs variant='unstyled' {...rest}>
      {children}
    </ChakraTabs>
  )
}

export default Tabs;