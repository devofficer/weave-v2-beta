import { useClient, useConnect } from 'wagmi'
import { useEffect } from 'react'

const SAFE_ID = 'okx'

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    const connectorInstance = connectors.find((c) => c.id === SAFE_ID && c.ready)
    if (
      connectorInstance &&
      // @ts-ignore
      !window.okexchain
    ) {
      connectAsync({ connector: connectorInstance }).catch(() => {
        client.autoConnect()
      })
    } else {
      client.autoConnect()
    }
  }, [client, connectAsync, connectors])
}

export default useEagerConnect
