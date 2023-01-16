import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi'

export function useWeb3React() {
  const { chain } = useNetwork()
  const { address, connector, isConnected, isConnecting } = useAccount()
  const { data: signer } = useSigner()
  const provider = useProvider()

  return {
    chainId: chain?.id,
    account: isConnected ? address : undefined, // TODO: migrate using `isConnected` instead of account to check wallet auth
    isConnected,
    isConnecting,
    chain,
    connector,
    provider,
    signer
  }
}
