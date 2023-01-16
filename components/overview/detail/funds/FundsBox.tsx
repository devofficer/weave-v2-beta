import dynamic from 'next/dynamic';
import { Flex } from '@chakra-ui/react'
import { IClaimableData, ILpData } from 'types';
const FunsList = dynamic(() => import('./FunsList'))
const ClaimableRewards = dynamic(() => import('./ClaimableRewards'))
// const Card = dynamic(() => import('components/common/Card'))

const FundsBox = ({
  claimData,
  lpData,
  contractAddress
}: {
  claimData: IClaimableData[],
  lpData: ILpData[],
  contractAddress: string
}) => {
  return (
    <Flex flexDirection={'column'} gap={4}>
      <ClaimableRewards data={claimData} />
      <FunsList lpData={lpData} claimData={claimData} contractAddress={contractAddress} />
    </Flex>
  )
}

export default FundsBox;