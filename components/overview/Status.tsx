import { Heading } from '@chakra-ui/react'

const Status = ({ status }: { status: string }) => {
  const statusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'green.400'
        break;
      case 'copied':
        return 'yellow.400'
      case 'draft':
        return 'red.400'
      default:
        break;
    }
  }
  return (
    <Heading size={'sm'} color={statusColor(status)} textTransform="capitalize">
      {status}
    </Heading>
  )
}

export default Status;