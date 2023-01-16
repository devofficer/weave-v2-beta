import NextLink from "next/link"
import { Flex, Image, Link, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { NavItemProps } from "types";

const NavItem = ({ label, icon, activeIcon, href, active, newTab, ...rest }: NavItemProps) => {

  const activeBg = useColorModeValue('secGray.300', 'dark.900');
  const activeBorderRadius = '8px 0 0 8px'
  const iconSrc = useColorModeValue(icon, icon)
  const activeIconSrc = useColorModeValue(activeIcon, icon)

  return (
    <NextLink href={href} passHref >
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} target={newTab ? '_blank' : '_self'}>
        <Tooltip label={label} >
          <Flex
            align="center"
            p="4"
            ml="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            justifyContent={'center'}
            sx={active ? {
              bg: activeBg,
              borderRadius: activeBorderRadius,
            } : undefined}
            {...rest}>
            {icon && (
              <Image
                boxSize="40px"
                src={!active ? iconSrc : activeIconSrc}
                alt='link'
              />
            )}
          </Flex>
        </Tooltip>
      </Link>
    </NextLink>
  );
};

export default NavItem