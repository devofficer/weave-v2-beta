import NextLink from "next/link"

import { Link as ChakraLink } from '@chakra-ui/react'
import { ILinkProps } from 'types';

const Link = ({ label, href, hoverColor, ...rest }: ILinkProps) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink
        _hover={{
          textDecoration: 'none',
          color: hoverColor
        }}
        {...rest}>
        {label}
      </ChakraLink>
    </NextLink>
  )
}

export default Link;