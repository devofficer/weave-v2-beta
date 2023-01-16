import { Box, Flex, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react';

const SettingCardBody = ({ tvl }: { tvl: number }) => {
  const [sliderValue, setSliderValue] = useState(50)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Flex flexDirection={'column'} bg={useColorModeValue('white', 'dark.800')} borderRadius={'xl'} gap={4}>
      <Flex gap={2} alignItems={'center'} justifyContent="space-between">
        <Heading as="h4" fontSize={'md'}>
          TVL
        </Heading>
        <Heading as="h4" fontSize={'md'}>
          {tvl?.toFixed(3)}$
        </Heading>
      </Flex>
      <Flex gap={2} alignItems={'center'} justifyContent="space-between">
        <Heading as="h4" fontSize={'md'}>
          Performance Fee
        </Heading>
        <Heading as="h4" fontSize={'xl'}>
          5.2%
        </Heading>
      </Flex>
      <Flex flexDirection={'column'} gap={2}>
        <Flex gap={2} alignItems={'center'} justifyContent="space-between">
          <Heading as="h4" fontSize={'md'}>
            <Flex>Next Milestone <Box color={'red.400'} >*</Box></Flex>
          </Heading>
          <Heading as="h4" fontSize={'md'}>
            100000.00
          </Heading>
        </Flex>
        <Flex>
          <Slider
            id='slider'
            defaultValue={55}
            isReadOnly={true}
            min={0}
            max={100}
            colorScheme={'slider'}
            onChange={(v) => setSliderValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack h={3} borderRadius="full">
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg={useColorModeValue('secGray.900', 'dark.500')}
              color='white'
              placement='top'
              isOpen={showTooltip}
              label={`${sliderValue}%`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        </Flex>
        <Flex gap={2} alignItems={'center'} justifyContent="space-between">
          <Heading as="h4" fontSize={'md'}>
            <Flex>Performance Fee <Box color={'red.400'} >*</Box></Flex>
          </Heading>
          <Heading as="h4" fontSize={'xl'}>
            3.2%
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SettingCardBody;