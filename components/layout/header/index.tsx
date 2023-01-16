import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic'
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerOverlay,
  useDisclosure,
  DrawerHeader,
  DrawerCloseButton,
  Flex,
  Heading,
} from '@chakra-ui/react';
const TopNavbar = dynamic(() => import('./TopNavbar'))
const Sidebar = dynamic(() => import('./Sidebar'))
const MobileNav = dynamic(() => import('./MobileNav'))
const Logo = dynamic(() => import('components/common/Logo'))

const Header = ({ children, active }: { children: ReactNode; active: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      bgGradient={useColorModeValue('linear(to-r, light.300, light.900)', 'linear(to-r, dark.600, dark.800)')}>
      <Sidebar
        active={active}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent borderBottomRadius={10} >
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems={'center'} gap={2}>
              <Logo />
              <Heading as="h2" size={'xl'} color={useColorModeValue('light.300', 'white')}>
                Weave Financial
              </Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <MobileNav />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 24 }} pl={{ base: 4, md: 0 }} pr={4} py={4}>
        <TopNavbar onNavbarOpen={onOpen} />
        <Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Header;