import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react'
import { IInputProps } from 'types';

const Input = ({ label, helperText, isError, errorText, leftIcon, rightIcon, value, handleChange, ...rest }: IInputProps) => {
  return (
    <FormControl isInvalid={isError}>
      {label &&
        <FormLabel>{label}</FormLabel>
      }
      <InputGroup>
        {leftIcon &&
          <InputLeftElement pointerEvents='none' >
            {leftIcon}
          </InputLeftElement>
        }
        <ChakraInput
          value={value}
          onChange={handleChange}
          borderRadius={'xl'}
          _focusVisible={{
            borderColor: 'none'
          }}
          {...rest} />
        {rightIcon &&
          <InputRightElement pointerEvents='none'>
            {rightIcon}
          </InputRightElement>
        }
      </InputGroup>
      {!isError ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{errorText}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default Input;