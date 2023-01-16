import NextLink from "next/link"
import {
  List,
  ListItem,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { LINKS } from "config";

const MobileNav = () => {
  const color = useColorModeValue('light.500', 'gray.50')
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100')

  return (
    <List spacing={3} transition="3s ease">
      {LINKS.map((link) => (
        <ListItem
          key={link.value}
          fontSize={'xl'}
          color={color}
          py={1}
          px={4}
          _hover={{
            bg: hoverBg
          }}>
          <NextLink href={link.href} passHref>
            <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
              {link.name}
            </Link>
          </NextLink>
        </ListItem>
      ))}
    </List>
  );
};
export default MobileNav;