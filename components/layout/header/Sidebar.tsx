import { Box, Flex } from "@chakra-ui/react";
import { LINKS } from "config";
import dynamic from 'next/dynamic';
import { SidebarProps } from "types";
const Logo = dynamic(() => import('components/common/Logo'))
const NavItem = dynamic(() => import('./NavItem'))
const Weavey = dynamic(() => import('./Weavey'))

const Sidebar = ({ active, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      w={{ base: 'full', md: 24 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="40" alignItems="center" mx="auto" justifyContent={{ base: "space-between", md: 'center' }}>
        <Logo />
      </Flex>
      {LINKS.map((link) => (
        <NavItem
          key={link.value}
          label={link.name}
          href={link.href}
          icon={link.icon}
          activeIcon={link.activeIcon}
          active={active === link.value ? true : false}
          newTab={link.name === 'Academy'}
        />
      ))}
      <Flex h="80" alignItems="center" mx="auto" justifyContent={{ base: "space-between", md: 'center' }}>
        <Weavey />
      </Flex>
    </Box>
  );
};
export default Sidebar;