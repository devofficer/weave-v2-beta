import StakingABIv2 from "artifacts/contracts/StakingContractv2.json";
import LPStakingABIv2 from "artifacts/contracts/LPStakingv2.json";
import FeeDistributorABI from "artifacts/contracts/FeeDistributor.json";

export const config: {
  [k: string]: any;
} = {
  single: {
    weaveAddress: "0x6CC97eF7D330C090681c3a6d266F6AdeDf80e56B",
    stakingContractAddressv2: "0x717E2896aaCb2573EAfE47Ef15c772163C5a441C",
    abi: StakingABIv2,
  },
  lp: {
    weaveAddress: "0x5661802b528e3B63FF8C5600Dd7B568530c44f3A",
    stakingContractAddressv2: "0xc5cFc9A86dCa3683a6a0b142DE3eF4318Af373CA",
    abi: LPStakingABIv2,
  },
  fee: {
    address: "0x10Bc1Fe8378554856fd020851308bAba1eCb5723",
    abi: FeeDistributorABI,
  },
};