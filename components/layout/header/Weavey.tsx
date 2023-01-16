import {
  Image,
  Popover as ChakraPopover,
  PopoverArrow,
  PopoverBody, PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { WEAVE_HELPER_ICON_URL } from 'config/constants';
import { useState } from 'react';
import { useWeaveyManager } from 'state/weavey/hooks';

const Weavey = () => {
  const { onClose } = useDisclosure()
  const { weavey } = useWeaveyManager();
  const [isEnabled, setEnabled] = useState(true);

  const handleClick = () => {
    setEnabled(!isEnabled)
  }

  return (
    <ChakraPopover
      placement="right"
      returnFocusOnClose={false}
      isOpen={weavey.isOpen && isEnabled}
      onClose={onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Image
          src={WEAVE_HELPER_ICON_URL}
          alt='Weavey'
          boxSize='60px'
          cursor={'pointer'}
          onClick={handleClick}
          sx={{
            filter: isEnabled ? 'grayscale(1)' : 'none',
            opacity: isEnabled ? '0.8' : '1'
          }} />
      </PopoverTrigger>
      <PopoverContent
        bg={useColorModeValue('whiteAlpha.800', 'dark.900')}
        color={useColorModeValue('gray.600', 'gray.100')}
        boxShadow="lg"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        backdropFilter={useColorModeValue('blur(5px)', 'blur(5px)')}
      >
        <PopoverHeader
          bg={useColorModeValue('whiteAlpha.800', 'dark.900')}
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          fontWeight="bold"
        >
          {weavey.title}
        </PopoverHeader>
        <PopoverArrow
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          bg={useColorModeValue('whiteAlpha.800', 'dark.900')}
        />
        <PopoverBody>
          {weavey.content}
        </PopoverBody>
      </PopoverContent>
    </ChakraPopover>
  )
}

export default Weavey
