import { IconButton as ChakraIconButton, Flex, useColorModeValue } from '@chakra-ui/react'
import { IIconButtonProps } from 'types';

const IconButton = ({ icon, ...rest }: IIconButtonProps) => {
  return (
    <Flex>
      <ChakraIconButton
        bg='none'
        color={useColorModeValue('gray.600', 'white')}
        _hover={{
          bg: 'none'
        }}
        icon={icon}
        {...rest} />
    </Flex >
  )
}

export default IconButton;