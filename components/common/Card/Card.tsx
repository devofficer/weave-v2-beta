import {
  Flex,
  Box,
  VStack,
  Heading,
  useColorModeValue
} from '@chakra-ui/react'
import { ICardProps } from 'types';

const Card = ({ title, header, headerAction, body, footer, ...rest }: ICardProps) => {
  return (
    <VStack w="full" rounded="xl" bg={useColorModeValue('white', 'dark.800')} p={5} {...rest}>
      <Flex w={'full'} pt={{ base: 1, md: 2 }} pb={{ base: 2, md: 3 }} className="card-header" justifyContent={header ? 'start' : 'space-between'}>
        {header ? (
          header
        ) : (
          <Heading as='h5' size='md'>
            {title}
          </Heading>
        )}
        {headerAction}
      </Flex>
      <Box className="card-body" w={'full'}>{body}</Box>
      {footer &&
        <Box className="card-footer" w={'full'} py={{ base: 2, md: 3 }}>{footer}</Box>
      }
    </VStack>
  )
}

export default Card;