import dynamic from 'next/dynamic'
import { Grid, GridItem, Button, Text } from '@chakra-ui/react'
const MetamaskIcon = dynamic(() => import('./icons/MetamaskIcon'));
const OntoIcon = dynamic(() => import('./icons/OntoIcon'));
const OKXIcon = dynamic(() => import('./icons/OKXIcon'));
import { useWallet } from 'hooks/useWallet'
import { useConnect } from 'wagmi';

const WalletConnect = ({ onClose }: { onClose: () => void }) => {

  const { connectWallet } = useWallet()
  // const { isConnected } = useAccount()
  const { connectors, isLoading } = useConnect();
  const handleWalletConnect = (connectorId: any) => {
    connectWallet(connectorId)
    if (!isLoading) {
      onClose()
    }
  };

  return (
    <Grid templateColumns='1fr 1fr' gap={8}>
      {connectors.map((connector) => (
        <GridItem w='100%' key={connector.id}>
          <Button
            display={"flex"}
            flexDirection={"column"}
            width={"100%"}
            height={"auto"}
            alignItems="center"
            py={4}
            colorScheme='gray'
            variant='ghost'
            disabled={!connector.ready}
            onClick={() => handleWalletConnect(connector.id)}
          >
            {connector.name === "MetaMask" &&
              <MetamaskIcon />
            }
            {connector.name === "Onto" &&
              <OntoIcon />
            }
            {connector.name === "Okx" &&
              <OKXIcon />
            }
            {!connector.ready &&
              <Text fontSize='xs' fontWeight={600}>Not installed</Text>
            }
          </Button>
        </GridItem>
      ))}
    </Grid>
  )
}

export default WalletConnect;