import { useState, useEffect } from "react";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Image, Tag, TagLabel, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import Input, { NumberInput } from "components/common/Input";
import { TOAST_OPTOPNS } from "config";
import { useStrategyBuilder } from "hooks/useStrategyBuilder";
import dynamic from "next/dynamic";
import { ISwapNodeData, Token } from "types";
import { useRouter } from "next/router";
const Button = dynamic(() => import('components/common/Button'));
const Modal = dynamic(() => import('components/common/Modal'));
const CurrencySelect = dynamic(() => import('components/CurrencySelect'));

const CanvasSwapItem = ({ data }: { data: ISwapNodeData }) => {
  const {
    id,
    token,
    protocol,
    weight,
    adjustSwapToken,
    deleteEntry,
  } = data
  const settingIconColor = useColorModeValue('gray.600', 'white')
  const settingIconHoverColor = useColorModeValue('light.400', 'dark.500')

  const { getSwapLogo, getSwapName } = useStrategyBuilder()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [selectedToken, setSelectedToken] = useState<Token>(token)
  const [swapWeight, setSwapWeight] = useState(weight);

  const router = useRouter()
  const isEditable = router.asPath === '/overview' ? false : true

  useEffect(() => {
    setSwapWeight(weight)
  }, [weight])

  const handleTokenUpdate = (token: Token) => {
    setSelectedToken(token);
  };

  const handleWeightChange = (value: number) => {
    if (value <= 100) {
      setSwapWeight(value)
    }
  }

  const handleSaveSwap = () => {
    if (swapWeight > 0 && swapWeight <= 100) {
      adjustSwapToken(id, selectedToken, protocol, swapWeight)
      onClose()
    }

    if (swapWeight == 0 || swapWeight > 100) {
      toast({
        title: 'Weight ',
        description: "Please adjust weight.",
        status: 'error',
        ...TOAST_OPTOPNS
      });
    }
  }

  const handleCloseCompound = () => {
    deleteEntry(id);
    onClose()
  }
  return (
    <>
      <Box
        width={'160px'}
        px={3}
        py={2}
        bg={useColorModeValue('white', 'whiteAlpha.50')}
        borderColor={useColorModeValue('gray.500', 'whiteAlpha.300')}
        color="white"
        borderWidth={1}
        borderRadius={10}>
        {isEditable &&
          <Flex
            onClick={onOpen}
            color={settingIconColor}
            justifyContent="flex-end"
            _hover={{
              color: settingIconHoverColor
            }}
          >
            <SettingsIcon />
          </Flex>
        }
        <Flex flexDirection={'column'} alignItems="center" gap={3}>
          <Flex gap={2}>
            <Flex justifyContent={'center'} gap={1}>
              <Image
                boxSize={4}
                src={selectedToken?.logoURI}
                alt={'swap'}
              />
            </Flex>
            <Heading as="h5" size={'xs'} color={useColorModeValue('gray.600', 'white')} >{selectedToken?.symbol}</Heading>
          </Flex>
          <Tag size='md' colorScheme='gray' borderRadius='full'>
            <Image
              boxSize={4}
              src={getSwapLogo()}
              alt={'swap'}
              ml={-1}
              mr={2}
            />
            <TagLabel fontSize={'sm'}>{getSwapName()}</TagLabel>
          </Tag>

        </Flex>
      </Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'md'}
        footer={
          <Flex gap={4}>
            <Button label={'Save'} onClick={handleSaveSwap} />
            <Button disabled={data.inOverview} label={'Remove'} colorType={'danger'} onClick={handleCloseCompound} />
          </Flex>
        }
      >

        <Flex flexDirection={'column'} gap={3}>
          <Flex justifyContent={'center'} gap={5}>
            <Flex flexDirection={'column'} alignItems="center" w="full">
              <Image
                boxSize={12}
                src={getSwapLogo()}
                alt={'swap'}
              />
              <Heading as='h6' size={'md'}>{getSwapName()}</Heading>
            </Flex>
            {/* <Flex flexDirection={'column'} alignItems="center" px={2} py={3} w="full" gap={2}>
              <Heading as='h6' size={'md'}>APY</Heading>
            </Flex> */}
          </Flex>
          <Flex flexDirection={'column'} gap={3}>
            <Flex gap={2}>
              <CurrencySelect
                token={selectedToken}
                onTokenUpdate={handleTokenUpdate} />
            </Flex>
            <NumberInput
              label='Weight (%)'
              value={swapWeight}
              handleChange={handleWeightChange} />
          </Flex>
        </Flex>
      </Modal>
    </>


  )
}

export default CanvasSwapItem;