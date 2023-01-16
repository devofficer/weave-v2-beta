import { Flex, Heading } from '@chakra-ui/react';
import PopularityIcon from 'components/icons/PopularityIcon';

const Popularity = ({ rate, isWithLabel }: { rate: number, isWithLabel?: boolean }) => {
  const rateColor = '#F56565';

  return (
    <Flex flexDirection={'column'} gap={2}>
      <Flex gap={1} justifyContent={'center'}>
        {Array.from({ length: 3 }, (v, i) => (
          <PopularityIcon key={i} width={{ sm: "16px", md: "16px", lg: "20px" }} color={rate > i ? rateColor : '#E2E8F0'} />
        ))}
      </Flex>
      {isWithLabel &&
        <Heading as="h4" size={'sm'} color={'white'} textTransform="uppercase">
          Popularity
        </Heading>
      }
    </Flex>
  )
}

export default Popularity;