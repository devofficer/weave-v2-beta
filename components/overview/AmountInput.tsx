import dynamic from 'next/dynamic';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react'
import { formatDisplayBalance } from 'utils/formatBalance';

const AmountInput = ({
  balance,
  amount,
  isError,
  errorText,
  onAmountChange,
  onMaxAmount
}: {
  balance: string,
  amount: number,
  isError?: boolean,
  errorText?: string,
  onAmountChange: (e: any) => void,
  onMaxAmount: () => void,
}) => {

  return (
    <Flex>
      <FormControl isInvalid={isError}>
        <Flex justifyContent={'space-between'} mb={2}>
          <Text>Balance: {formatDisplayBalance(balance, 3)}</Text>
          <Tag size={'xs'} variant='outline' px={2} cursor="pointer" colorScheme={useColorModeValue('light', 'dark')} onClick={onMaxAmount}>
            Max
          </Tag>
        </Flex>
        <ChakraNumberInput
          precision={2}
          step={0.1}
          min={0}
          focusInputOnChange={true}
          value={amount}
          onChange={onAmountChange}
          _focusVisible={{
            boxShadow: 'none',
            outline: 'none'
          }} >
          <NumberInputField
            _focusVisible={{
              boxShadow: 'none',
              outline: 'none'
            }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </ChakraNumberInput>
        {isError &&
          <FormErrorMessage>{errorText}</FormErrorMessage>
        }
      </FormControl>

    </Flex>
  )
}

export default AmountInput;