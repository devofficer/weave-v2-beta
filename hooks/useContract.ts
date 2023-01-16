import { Signer } from '@wagmi/core';
import { ContractFactory } from '@ethersproject/contracts'
import {
  createContractFactory,
  protocolIDs,
  routersOnBsc,
  routersOnFantom,
  masterchefsOnBsc,
  masterchefsOnFantom,
  rewardTokensOnBsc,
  rewardTokensOnFantom,
  controllerWalletOnBsc,
  controllerWalletOnFantom,
  feeWalletOnBsc,
  feeWalletOnFantom,
  charityWalletOnBsc,
  charityWalletOnFantom,
  stakingWalletOnBsc,
  stakingWalletOnFantom,
  platformOwner,
  referrer,
  proWallet,
} from 'utils/contractHelpers';

// ABI, Bytecode
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import strategyArtifactFTM from 'artifacts/contracts/StrategyFTM.sol/StrategyFTM.json'
import BusdABI from "artifacts/contracts/Busd.json";
import LPTokenABI from "artifacts/contracts/LPToken.json";
import FeeDistributorABI from "artifacts/contracts/FeeDistributor.json";

import { ChainId } from 'utils/chains';
import { useSigner } from 'wagmi'
import { config } from 'config/stake';
import { ethers } from 'ethers';

const weaveABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
];

export const deployStrategyContract = async (chainId: number | undefined, signer: Signer) => {
  let strategyContract: ContractFactory

  if (chainId === ChainId.BSC || chainId === ChainId.WEAVE_TESTNET || chainId === ChainId.BSC_TESTNET) {
    strategyContract = createContractFactory(strategyArtifactBNB.abi, strategyArtifactBNB.bytecode, signer)
    const strategyContractDeploy = await strategyContract!.deploy(
      protocolIDs,
      routersOnBsc,
      masterchefsOnBsc,
      rewardTokensOnBsc,
      platformOwner,
      referrer,
      controllerWalletOnBsc,
      feeWalletOnBsc,
      charityWalletOnBsc,
      stakingWalletOnBsc,
      proWallet
    );

    const deployedTX = await strategyContractDeploy.deployed();
    console.log(deployedTX)
    return deployedTX
  }
  if (chainId === ChainId.FANTOM || chainId === ChainId.FANTOM_TESTNET) {
    strategyContract = createContractFactory(strategyArtifactFTM.abi, strategyArtifactFTM.bytecode, signer)

    const strategyContractDeploy = await strategyContract!.deploy(
      protocolIDs,
      routersOnFantom,
      masterchefsOnFantom,
      rewardTokensOnFantom,
      platformOwner,
      referrer,
      controllerWalletOnFantom,
      feeWalletOnFantom,
      charityWalletOnFantom,
      stakingWalletOnFantom,
      proWallet
    );

    const deployedTX = await strategyContractDeploy.deployed();
    console.log(deployedTX)
    return deployedTX
  }
}

export const useStakingContract = (type: string) => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    config[type].stakingContractAddressv2,
    config[type].abi,
    signer
  );

  return contract;
}

export const useWeaveBusdContract = (type: string) => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    config[type].weaveAddress,
    BusdABI,
    signer
  );

  return contract;
}

export const useBusdContract = () => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    BusdABI,
    signer
  );

  return contract;
}

export const useWeaveContract = () => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    config['single'].weaveAddress,
    weaveABI,
    signer
  );

  return contract;
}

export const useWeaveLPContract = () => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    config['lp'].weaveAddress,
    LPTokenABI,
    signer
  );

  return contract;
}

export const useFeeContract = () => {
  const { data: signer } = useSigner()
  if (!signer) {
    return;
  }
  const contract = new ethers.Contract(
    config['fee'].address,
    FeeDistributorABI,
    signer
  );

  return contract;
}