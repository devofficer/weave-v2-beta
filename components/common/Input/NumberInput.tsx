import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import { INumberInputProps } from 'types';

const NumberInput = ({ label, helperText, isError, errorText, value, handleChange, ...rest }: INumberInputProps) => {
  return (
    <Flex>
      <FormControl isInvalid={isError}>
        {label &&
          <FormLabel>{label}</FormLabel>
        }
        <ChakraNumberInput
          precision={2}
          step={0.1}
          min={0}
          focusInputOnChange={true}
          value={value}
          onChange={handleChange}
          _focusVisible={{
            boxShadow: 'none',
            outline: 'none'
          }}
          {...rest} >
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
        {!isError ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : (
          <FormErrorMessage>{errorText}</FormErrorMessage>
        )}
      </FormControl>

    </Flex>
  )
}

export default NumberInput;