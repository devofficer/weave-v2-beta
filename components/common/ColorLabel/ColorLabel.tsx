import { Circle, SquareProps } from '@chakra-ui/react'

interface IColorLabelProps extends SquareProps {
  color: string;
}

const ColorLabel = ({ color, ...rest }: IColorLabelProps) => {
  return (
    <Circle size={6} bg={color} borderRadius="full" {...rest}></Circle>
  )
}

export default ColorLabel;