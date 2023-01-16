import { Heading } from '@chakra-ui/react'
import { riskColor } from 'utils'

const Risk = ({ risk }: { risk: string }) => {
  return (
    <Heading size={'sm'} color={riskColor(risk)}>
      {risk}
    </Heading>
  )
}

export default Risk;