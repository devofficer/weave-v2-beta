// import BigNumber from 'bignumber.js'
// import { BigNumber as EthersBigNumber, FixedNumber } from '@ethersproject/bignumber'
// import { formatUnits } from '@ethersproject/units'

import { BigNumberish, utils } from "ethers";


export const formatDisplayBalance = (balance: string | undefined, displayDecimals: number) => {
  return (balance !== undefined && balance !== '0.0') ? parseFloat(balance).toFixed(displayDecimals) : '0.0'
}

export const formatEther = (balance: BigNumberish) => {
  return Number(utils.formatEther(balance))
}

export const formatAmount = (amount: number) => {
  return utils.parseEther(amount.toString());
}