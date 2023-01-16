import {
  Flex,
  Button,
  Popover as ChakraPopover,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverContent,
  useColorModeValue,
  IconButton,
  Box,
  keyframes,
} from '@chakra-ui/react'
import { IPopoverProps } from 'types';

import React from 'react';

const StatusIndicator = () => {
  const activeColor = 'red.500';
  const ringScaleMin = 0.33;
  const ringScaleMax = 0.66;

  const pulseRing = keyframes`
    0% {
      transform: scale(${ringScaleMin});
    }
    30% {
      transform: scale(${ringScaleMax});
    },
    40%,
    50% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
	`;

  const pulseDot = keyframes`
    0% {
      transform: scale(0.9);
    }
    25% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(0.9);
    }
	`;

  return (
    <Flex
      position="absolute"
      top={-1}
      right={-1}
      justifyContent="center"
      alignItems="center"
      flexDir="column">
      <Box
        as="div"
        h="16px"
        w="16px"
        mb="1.99em"
        position="relative"
        bgColor={activeColor}
        borderRadius="50%"
        _before={{
          content: "''",
          position: 'relative',
          display: 'block',
          width: '300%',
          height: '300%',
          boxSizing: 'border-box',
          marginLeft: '-100%',
          marginTop: '-100%',
          borderRadius: '50%',
          bgColor: activeColor,
          animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
        }}
        _after={{
          animation: `2.25s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
        }}
      />
    </Flex>
  );
}

const Popover = ({ children, label, isAvatar, isIcon, icon, isNew, ariaLabel, ...rest }: IPopoverProps) => {
  const buttonBg = useColorModeValue('white', 'dark.800');
  const buttonHoverBg = useColorModeValue('gray.100', 'dark.800');
  const color = useColorModeValue('gray.600', 'gray.100');
  const contentBg = useColorModeValue('whiteAlpha.800', 'dark.700');
  const contentBoderColor = useColorModeValue('gray.100', 'dark.700');

  return (
    <Flex alignItems={'center'}>
      <ChakraPopover>
        <PopoverTrigger>
          <Box position="relative">
            {isAvatar ? (
              <IconButton aria-label={ariaLabel} icon={icon} bg="none" _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} />
            ) : (
              isIcon ? (
                <IconButton
                  bg={buttonBg}
                  color={color}
                  _hover={{
                    bg: buttonHoverBg,
                  }}
                  aria-label={ariaLabel}
                  fontSize={'lg'}
                  icon={icon}
                  {...rest} />
              ) : (
                <Button
                  bg={buttonBg}
                  color={color}
                  _hover={{
                    bg: buttonHoverBg,
                  }}
                  {...rest}>
                  {label}
                </Button>
              )
            )}
            {isNew &&
              <StatusIndicator />
            }
          </Box>
        </PopoverTrigger>
        <PopoverContent
          bg={contentBg}
          color={color}
          boxShadow="lg"
          borderColor={contentBoderColor}
          backdropFilter={'blur(5px)'}>
          <PopoverArrow
            borderColor={contentBoderColor}
            bg={contentBg} />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </ChakraPopover>
    </Flex>
  )
}

export default Popover;