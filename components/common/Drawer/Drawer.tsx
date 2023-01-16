import { Drawer as ChakraDrawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, DrawerProps, useColorModeValue } from '@chakra-ui/react'

interface IDrawerProps extends DrawerProps {
  children: any;
  isOverlay?: boolean;
}

const Drawer = ({ children, isOverlay = true, ...rest }: IDrawerProps) => {
  return (
    <ChakraDrawer
      blockScrollOnMount={false}
      {...rest}
    >
      {isOverlay &&
        <DrawerOverlay />
      }
      <DrawerContent
        bg={useColorModeValue('whiteAlpha.900', 'dark.900')}
        color={useColorModeValue('gray.600', 'gray.100')}
        boxShadow="lg"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        backdropFilter={useColorModeValue('blur(5px)', 'blur(5px)')}
        borderTopLeftRadius={10}
        borderBottomLeftRadius={10}
        px={{ base: 0, md: 5 }}
        py={10}>
        <DrawerCloseButton />
        <DrawerBody>
          {children}
        </DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  )
}
export default Drawer;