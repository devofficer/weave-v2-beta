import { Button as ChakraButton, useColorModeValue } from '@chakra-ui/react'
import { IButtonProps } from 'types';

// colorType = {'primary', 'secondary', 'danger' }
const Button = ({ label, colorType = 'primary', leftIcon, rightIcon, value, onClick, ...rest }: IButtonProps) => {
  let bgColor = useColorModeValue('light.300', 'dark.500');
  let hoverColor = useColorModeValue('light.400', 'dark.600');
  const secBgColor = useColorModeValue('gray.100', 'whiteAlpha.200');
  const secHoverColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  let color = 'white';

  switch (colorType) {
    case 'primary':
      bgColor = 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)';
      hoverColor = 'linear-gradient(135deg, rgb(100, 140, 255) 0%, rgb(40, 10, 255) 100%)';
      break;
    case 'secondary':
      bgColor = secBgColor;
      hoverColor = secHoverColor;
      color = 'inherit';
      break;
    case 'danger':
      bgColor = 'red.500';
      hoverColor = 'red.600';
      break;
    default:
      break;
  }

  return (
    <ChakraButton
      px={{ base: 2, md: 4 }}
      py={{ base: 1, md: 1.5 }}
      fontSize={{ base: 'md', md: 'lg' }}
      fontWeight={500}
      rounded={'xl'}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      lineHeight={'inherit'}
      // height="100%"
      color={color}
      colorScheme="gray"
      bg={bgColor}
      _hover={{
        bg: hoverColor,
        borderColor: hoverColor
      }}
      _focus={{
        bg: hoverColor,
        borderColor: hoverColor
      }}
      _focusVisible={{
        boxShadow: 'none'
      }}
      onClick={() => onClick(value)}
      {...rest}>
      {label}
    </ChakraButton>
  )
}

export default Button;