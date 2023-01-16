import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Image, SimpleGrid, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import { NumberInput } from "components/common/Input";
import { TOAST_OPTOPNS } from "config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IFarmNodeData } from "types";
const Button = dynamic(() => import('components/common/Button'));
const Modal = dynamic(() => import('components/common/Modal'));
// const RiskProgressLine = dynamic(() => import('components/common/RiskProgressLine'));

const CanvasFarmItem = ({ data }: { data: IFarmNodeData }) => {
  const {
    id,
    recompound,
    frequency,
    poolID,
    protocol,
    weight,
    adjustCompound,
    deleteEntry,
  } = data

  const settingIconColor = useColorModeValue('gray.600', 'white')
  const settingIconHoverColor = useColorModeValue('light.400', 'dark.500')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [compoundAmount, setCompoundAmount] = useState(recompound);
  const [compoundFrequency, setCompoundFrequency] = useState(frequency)
  const [farmWeight, setFarmWeight] = useState(weight);

  const router = useRouter()
  const isEditable = router.asPath === '/overview' ? false : true

  const handleCompoundChange = (e: any) => {
    if (e >= 0 && e <= 100) {
      setCompoundAmount(e);
    }
  };

  const handleCompoundFrequencyChange = (e: any) => {
    if (e <= 30) {
      setCompoundFrequency(e);
    } else {
      toast({
        title: 'Frequency (days)',
        description: "Frequency cannot be higher than 30",
        status: 'error',
        ...TOAST_OPTOPNS
      });
    }
  };

  const handleWeightChange = (e: any) => {
    if (e <= 100) {
      setFarmWeight(e);
    }
  }


  const handleSaveCompound = () => {
    console.log();
    if ((farmWeight > 0 && farmWeight <= 100) && (compoundAmount >= 0 && compoundAmount <= 100) && (compoundAmount.toString() !== "")) {
      adjustCompound(id, protocol, poolID, compoundAmount, compoundFrequency, farmWeight)
      onClose()
    }

    if (compoundAmount < 0 || compoundAmount > 100 || compoundAmount.toString() === "") {
      toast({
        title: 'Compound Amount',
        description: "Please adjust compound amount.",
        status: 'error',
        ...TOAST_OPTOPNS
      });
    }

    if (farmWeight <= 0 || farmWeight > 100) {
      toast({
        title: 'Weight ',
        description: "Please adjust Weight %",
        status: 'error',
        ...TOAST_OPTOPNS
      });
    }
  }

  const handleCloseCompound = () => {
    deleteEntry(id);
    onClose()
  }

  useEffect(() => {
    setFarmWeight(weight);
  }, [weight])

  useEffect(() => {
    setCompoundFrequency(frequency);
  }, [frequency])

  return (
    <>
      <Box
        width={'160px'}
        px={3}
        py={2}
        bg={useColorModeValue('white', 'whiteAlpha.100')}
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
          <Flex justifyContent={'center'} gap={1}>
            <Image
              boxSize={8}
              src={data?.icons[0]}
              alt={'farm'}
            />
            <Image
              boxSize={8}
              src={data?.icons[1]}
              alt={'farm'}
            />
          </Flex>
          <Text fontSize={'lg'} fontWeight={600} color={useColorModeValue('gray.600', 'white')} >{data?.name}</Text>

          <Flex width={'full'} px={3} justifyContent={'space-between'}>
            <Text fontSize={'lg'} fontWeight={600} color={useColorModeValue('gray.600', 'gray.100')} whiteSpace="nowrap">APR</Text>
            <Text fontSize={'lg'} fontWeight={600} color={useColorModeValue('gray.600', 'gray.100')} whiteSpace="nowrap">{data?.apr ? data?.apr + '%' : '-'}</Text>
          </Flex>
        </Flex>
      </Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'md'}
        footer={
          <Flex gap={4}>
            <Button label={'Save'} onClick={handleSaveCompound} colorScheme="cyan" />
            <Button disabled={data.inOverview} label={'Remove'} colorType={'danger'} onClick={handleCloseCompound} colorScheme="red" />
          </Flex>
        }
      >
        <Flex flexDirection={'column'} gap={3}>
          <Flex justifyContent={'center'} gap={5}>
            <Flex flexDirection={'column'} alignItems="center" w="full">
              <Flex gap={-3}>
                <Image
                  boxSize={12}
                  src={data?.icons[0]}
                  alt={'farm'}
                />
                <Image
                  boxSize={12}
                  src={data?.icons[1]}
                  alt={'farm'}
                />
              </Flex>
              <Text fontSize={'md'} fontWeight={600} >{data?.name}</Text>
            </Flex>
            <Flex flexDirection={'column'} alignItems="center" px={2} py={3} w="full" gap={2}>
              <Text fontSize={'md'} fontWeight={600} >APY</Text>
              <Text fontSize={'md'} fontWeight={600} >{data?.apy ? data?.apy + '%' : '-'}</Text>
            </Flex>
          </Flex>
          {/* <Flex flexDirection={'column'} gap={1} width="full">
            <RiskProgressLine
              label="Risk"
              bg={'grey.500'}
              visualParts={[
                {
                  percentage: "40%",
                  color: "#68D391"
                },
                {
                  percentage: "30%",
                  color: "#F6E05E"
                },
                {
                  percentage: "15%",
                  color: "#E53E3E"
                },
                {
                  percentage: "15%",
                  color: "#9C4221"
                }
              ]}
            />
          </Flex> */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            <NumberInput
              label='Compound Amount (%)'
              value={compoundAmount}
              handleChange={handleCompoundChange} />
            <NumberInput
              label='Frequency (days)'
              value={compoundFrequency}
              handleChange={handleCompoundFrequencyChange} />
            <NumberInput
              label='Weight (%)'
              value={farmWeight}
              handleChange={handleWeightChange} />
          </SimpleGrid>
        </Flex>
      </Modal>
    </>
  )
}

export default CanvasFarmItem;