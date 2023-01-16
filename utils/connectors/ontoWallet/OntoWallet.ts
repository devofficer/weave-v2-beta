/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import {
  Chain,
  ConnectorNotFoundError,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
  SwitchChainNotSupportedError,
  AddChainError,
  SwitchChainError,
  ProviderRpcError,
  ChainNotConfiguredError,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { hexValue } from '@ethersproject/bytes'

const mappingNetwork: Record<number, string> = {
  56: 'bsc-mainnet',
  250: 'fantom',
  137: 'polygon',
  // 66: 'okexchain-mainnet'
  31337: 'weave-testnet'
}

const _ontoChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'Onto', {
      get() {
        return this.onto
      },
      set(onto) {
        this.onto = onto

        resolve()
      },
    }),
  )

export class OntoWalletConnector extends InjectedConnector {
  readonly id = 'onto'

  readonly ready = typeof window !== 'undefined' && typeof window.onto !== 'undefined'

  provider?: Window['onto']

  constructor({
    chains: _chains,
  }: {
    chains?: Chain[]
  } = {}) {
    const options = {
      name: 'Onto',
      shimDisconnect: false,
      shimChainChangedDisconnect: true,
    }
    const chains = _chains?.filter((c) => !!mappingNetwork[c.id])
    super({
      chains,
      options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    console.log('onto:chainId', chainId)
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      console.log('onto:id', id)
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error)
      if ((<RpcError>error).code === -32002) throw new ResourceUnavailableError(error)
      throw error
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      if (window.onto) {
        this.provider = window.onto
      } else {
        await _ontoChainListener()
        this.provider = window.onto
      }
    }
    return this.provider
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    const id = hexValue(chainId)
    console.log(provider)
    if (mappingNetwork[chainId]) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }],
        })

        return (
          this.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            rpcUrls: { default: '' },
          }
        )
      } catch (error) {
        const chain = this.chains.find((x) => x.id === chainId)
        if (!chain) throw new ChainNotConfiguredError()
        // Indicates chain is not added to provider
        if (
          (<ProviderRpcError>error).code === 4902 ||
          // Unwrapping for MetaMask Mobile
          // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
          (<RpcError<{ originalError?: { code: number } }>>error)?.data
            ?.originalError?.code === 4902
        ) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: id,
                  chainName: chain.name,
                  nativeCurrency: chain.nativeCurrency,
                  rpcUrls: [chain.rpcUrls.public ?? chain.rpcUrls.default],
                  blockExplorerUrls: this.getBlockExplorerUrls(chain),
                },
              ],
            })
            return chain
          } catch (addError) {
            if (this.isUserRejectedRequestError(addError))
              throw new UserRejectedRequestError(error)
            throw new AddChainError()
          }
        }

        if (this.isUserRejectedRequestError(error))
          throw new UserRejectedRequestError(error)
        throw new SwitchChainError(error)
      }
    }
    throw new SwitchChainNotSupportedError({ connector: this })
  }
}
