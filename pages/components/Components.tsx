import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  Flex,
  Heading,
  Button as ChakraButton,
  useToast,
  Code,
  SimpleGrid,
  Box,
  Text,
  Stack,
  Avatar,
  Image,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon, BellIcon, CheckIcon, AtSignIcon } from '@chakra-ui/icons';
import { BuilderSortNFilterType, IDropdownItem } from 'types';
import { TOAST_OPTOPNS } from 'config';
import { optionBuilder } from 'config/sort_filter_options';

const Home = dynamic(() => import('components/layout/Home'))
const Dropdown = dynamic(() => import('components/common/Dropdown'))
const Button = dynamic(() => import('components/common/Button'))
const Popover = dynamic(() => import('components/common/Popover'))
const Input = dynamic(() => import('components/common/Input'))
const NumberInput = dynamic(() => import('components/common/Input/NumberInput'))
const Card = dynamic(() => import('components/common/Card'))
const Link = dynamic(() => import('components/common/Link'))
const Modal = dynamic(() => import('components/common/Modal'))
const Drawer = dynamic(() => import('components/common/Drawer'))
const SortNFilter = dynamic(() => import('components/common/SortNFilter'))

const dropdownItems: IDropdownItem[] = [
  { label: 'New Menu Item-1', icon: <AddIcon /> },
  { label: 'New Menu Item-2', icon: <AddIcon /> },
  { label: 'New Menu Item-3', icon: <AddIcon /> },
  { label: 'New Menu Item-4', icon: <AddIcon /> }
];

const statuses: any = ['success', 'error', 'warning', 'info', 'loading']

const SampleCardBody = () => {
  return (
    <>
      <Box
        bg={'gray.100'}
        mb={6}
        pos={'relative'}>
        <Image
          src={
            'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          }
          fallbackSrc={'/images/default.png'}
          alt="image"
        />
      </Box>
      <Stack>
        <Text
          color={'green.500'}
          textTransform={'uppercase'}
          fontWeight={800}
          fontSize={'sm'}
          letterSpacing={1.1}>
          Blog
        </Text>
        <Heading
          color={useColorModeValue('gray.700', 'white')}
          fontSize={'2xl'}
          fontFamily={'body'}>
          Boost your conversion rate
        </Heading>
        <Text color={'gray.500'}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
          et ea rebum.
        </Text>
      </Stack>
      <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
        <Avatar
          src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
        />
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text fontWeight={600}>Achim Rolle</Text>
          <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
        </Stack>
      </Stack>
    </>
  )
}

const Components: NextPage = () => {
  const toast = useToast()
  const [text, setText] = useState('');
  const [number, setNumber] = useState(0);
  const [isError, setIsError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const initialBuilderOption: BuilderSortNFilterType = {
    sortValue: '0',
    protocols: [
      "PCS",
      "Baby",
      "Knight",
      "Spirit",
      "Spooky",
      "Ape"
    ],
    farmType: [
      "LP",
      "Single Staking"
    ],
    onlyStable: true,
    byApr: {
      enabled: true,
      minValue: 30,
      maxValue: 80
    }
  }

  const [sortFilterOption, setSortFilterOption] = useState<BuilderSortNFilterType>(initialBuilderOption);

  const onHandleClose = () => {
    setIsDrawerOpen(false)
  }

  const onHandleOpen = () => {
    setIsDrawerOpen(true)
  }

  const handleDropdownItemClick = (data: IDropdownItem) => {
    console.log('dropdown', data)
  }

  const handleButtonClick = (data: any) => {
    console.log('button', data)
    toast({
      title: 'Button',
      description: "We've created your account for you.",
      status: 'success',
      ...TOAST_OPTOPNS
    });
  }

  const handleInputChange = (event: any) => {
    setText(event.target.value)
    if (event.target.value === 'error') {
      setIsError(true)
    } else {
      setIsError(false)
    }
  };

  const handleNumberInputChange = (event: any) => {
    setNumber(event.target.value)
    if (event.target.value === 0.1) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  };

  const handleSortNFilterOption = (key: string, value: any) => {
    setSortFilterOption({ ...sortFilterOption, [key]: value });
  }

  return (
    <Home title="Weave Finanial | Global Components" active='components'>
      <Flex flexDirection={'column'} gap={8}>
        <Heading as='h3' size='lg'>
          Global Components
        </Heading>

        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Button
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={2}>
            <Button label={'Click Me'} value={1} onClick={handleButtonClick} fontSize="sm" />
            <Button colorType='secondary' leftIcon={<SettingsIcon />} label={'Click Me'} value={2} onClick={handleButtonClick} />
            <Button colorType='danger' rightIcon={<SettingsIcon />} label={'Click Me'} value={3} onClick={handleButtonClick} />
          </SimpleGrid>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Link
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
            <Link label={'Click Me'} href="/" fontSize="sm" />
            <Link label={'Click Me'} href="/" fontSize="sm" color={'green.500'} hoverColor={'green.700'} />
            <Link label={'Click Me'} href="/" fontSize="md" />
            <Link label={'External Link'} href="/" fontSize="md" isExternal />
          </SimpleGrid>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Input Box
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            <Input
              label='Input'
              value={text}
              handleChange={handleInputChange} />
            <Input
              label='Input with Left Icon'
              leftIcon={<AtSignIcon color={'gray.300'} />}
              value={text}
              handleChange={handleInputChange} />
            <Input
              label='Input with Right Icon and Helper Text'
              rightIcon={<CheckIcon color={'green.500'} />}
              helperText="This is helper text"
              value={text}
              handleChange={handleInputChange} />
            <Input
              label='Input with Valid'
              value={text}
              helperText="If you input 'error', it showing error message"
              isError={isError}
              errorText='This is not match'
              handleChange={handleInputChange} />
          </SimpleGrid >
          <Flex flexDirection={'column'} gap={4}>
            <Flex gap={2}>
              <NumberInput
                label='Number Input'
                value={number}
                handleChange={handleNumberInputChange} />
              <NumberInput
                label='Number Input'
                helperText="This is helper text"
                value={number}
                handleChange={handleNumberInputChange} />
            </Flex>
            <Code>Number Input value: {number}</Code>
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Dropdown
          </Heading>
          <Dropdown icon={<SettingsIcon />} items={dropdownItems} onClick={handleDropdownItemClick} />
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Toast
          </Heading>
          <Flex gap={2}>
            {statuses.map((status: any, i: any) => (
              <ChakraButton
                key={i}
                fontSize="sm"
                onClick={() => {
                  toast({
                    title: `${status} toast`,
                    description: 'This is sample alert',
                    status: status,
                    ...TOAST_OPTOPNS
                  })
                }}>
                {status}
              </ChakraButton>
            ))}
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Popover(Menu)
          </Heading>
          <Flex gap={2}>
            <Popover label="Text Popover" ariaLabel="sample-1">
              Are you sure you want to have that milkshake?
            </Popover>
            <Popover isIcon={true} icon={<AddIcon />} ariaLabel="sample-2">
              Are you sure you want to have that milkshake?
            </Popover>
            <Popover isNew={true} isIcon={true} icon={<BellIcon />} ariaLabel="sample-3">
              Are you sure you want to have that milkshake?
            </Popover>
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Modal
          </Heading>
          <Flex>
            <Button label={'Open Modal'} value={1} onClick={onOpen} fontSize="sm" />
            <Modal
              onClose={onClose}
              isOpen={isOpen}
              title="Modal Title"
              footer={<Button label={'Close'} onClick={onClose} fontSize="sm" />}
            >
              <Input
                label='Input with Left Icon'
                leftIcon={<AtSignIcon color={'gray.300'} />}
                value={text}
                helperText="Helper text"
                handleChange={handleInputChange} />
            </Modal>
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Card
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            <Card
              title='Defaut Card'
              body={<SampleCardBody />}
              headerAction={<Flex>X</Flex>}
            />
          </SimpleGrid >
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Drawer
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            <Button
              label='Open Drawer'
              onClick={onHandleOpen}
            />
            <Drawer isOverlay={true} isOpen={isDrawerOpen} placement='right' size="xl" onClose={onHandleClose}>
              <div>Test</div>
            </Drawer>
          </SimpleGrid >
        </Flex>
        <Flex flexDirection={'column'} gap={4}>
          <Heading as='h5' size='md'>
            Sort/Filter
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}
          >
            <SortNFilter
              option={optionBuilder}
              value={sortFilterOption}
              handleOption={handleSortNFilterOption}
            />
            {/* <SortNFilter option={option_overview} /> */}
          </SimpleGrid>
        </Flex>
      </Flex>
    </Home>
  );
};

export default Components;
