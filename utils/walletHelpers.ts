import { Provider } from '@wagmi/core';
import { Wallet } from '@ethersproject/wallet'

export const createWallet = (privateKey: string, provider: Provider) => {
  return new Wallet(privateKey, provider);
}

