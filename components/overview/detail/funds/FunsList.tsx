import dynamic from 'next/dynamic';
import { Flex, Text } from '@chakra-ui/react'
import { IClaimableData, ILpData } from 'types';
const Card = dynamic(() => import('components/common/Card'))
const FundsListItem = dynamic(() => import('./FundsListItem'))

const FunsListBody = ({
  lpData,
  claimData,
  contractAddress,
}: {
  lpData: ILpData[],
  claimData: IClaimableData[],
  contractAddress: string
}) => {
  return (
    <Flex flexDirection={'column'} gap={3} minHeight={'calc(100vh - 480px)'} maxHeight={'calc(100vh - 480px)'} overflow="auto">
      {lpData.length !== 0 && lpData?.map((item, i) => (
        <FundsListItem key={i} data={item} claimData={claimData} contractAddress={contractAddress} />
      ))}
      {lpData.length === 0 &&
        <Flex justifyContent={'center'} alignItems="center" py={10}>
          <Text>No Data</Text>
        </Flex>
      }
    </Flex>
  )
}

const FunsList = ({
  lpData,
  claimData,
  contractAddress
}: {
  lpData: ILpData[],
  claimData: IClaimableData[],
  contractAddress: string
}) => {
  return (
    <Card
      title={'Funds'}
      body={<FunsListBody lpData={lpData} claimData={claimData} contractAddress={contractAddress} />}
    />
  )
}
export default FunsList;