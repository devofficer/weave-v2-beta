import { Signer } from '@wagmi/core';
import { ContractFactory } from '@ethersproject/contracts'

export const createContractFactory = (
  abi: any,
  bytecode: any,
  signer?: Signer | undefined,
) => {
  return new ContractFactory(abi, bytecode, signer)
}

export const protocolIDs = [0, 1, 2];
export const platformOwner = "0x0a080BCC90BCdBd41dA52596f4E4343d6ff81881";
export const referrer = "0x0000000000000000000000000000000000000000";
export const proWallet = "0x0000000000000000000000000000000000000000";

export const routersOnBsc = [
  "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  "0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd",
  "0x05E61E0cDcD2170a76F9568a110CEe3AFdD6c46f",
];

export const masterchefsOnBsc = [
  "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
  "0xdfAa0e08e357dB0153927C7EaBB492d1F60aC730",
  "0xE50cb76A71b0c52Ab091860cD61b9BA2FA407414",
];

export const rewardTokensOnBsc = [
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657",
  "0xD23811058Eb6e7967D9a00dc3886E75610c4AbBa",
];

export const controllerWalletOnBsc = "0xc210402bb1022739128B46363C7aD4235c9E65d7";
export const feeWalletOnBsc = "0xF5c9191ab42D082E8c108BFB8E40d244218e6dF5";
export const charityWalletOnBsc = "0x616B68E7950Cb702978084622b64dEa4e25440ff";
export const stakingWalletOnBsc = "0x8cEEa7A821a840837676645fa0f11F7f4D8DF7a0";

export const routersOnFantom = [
  "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
  "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
];

export const masterchefsOnFantom = [
  "0x9083EA3756BDE6Ee6f27a6e996806FBD37F6F093",
  "0x2b2929E785374c651a81A63878Ab22742656DcDd",
  "0x18b4f774fdC7BF685daeeF66c2990b1dDd9ea6aD",
];

export const rewardTokensOnFantom = [
  "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
  "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
  "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
];

export const controllerWalletOnFantom = "0x86f9ABe6fF0ef3462c056F0F5b2b188CBbE9c654";
export const feeWalletOnFantom = "0x0cA7466315aC678BdB5D0d736fE6b489c899Da17";
export const charityWalletOnFantom = "0x2ECEc7087d95B37D3CAf12Ee127770F9d52020F9";
export const stakingWalletOnFantom = "0x64422bd54056eF8432Fc98538349189Ee3Ec2A57";