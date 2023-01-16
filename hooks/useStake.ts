import { useToast } from '@chakra-ui/react';
import { TOAST_OPTOPNS } from 'config';
import { formatEther, formatDisplayBalance, formatAmount } from 'utils/formatBalance';
import { BigNumber, ethers, Signer, utils } from 'ethers';
import { useSigner } from 'wagmi';
import { config } from 'config/stake';
import { useStakingContract, useWeaveBusdContract, useBusdContract, useWeaveContract, useWeaveLPContract, useFeeContract } from 'hooks/useContract';
import { useCallback, useEffect, useState } from 'react';
import signerArray from "config/MTree/signerArray.json";
import bigAmountArray from "config/MTree/bigAmountArray.json";
import { getMerkleTree, getLeafNode } from "config/MTree/merkleTree";

export const useUserBalance = (type: string) => {
  const [userBalance, setUserBalance] = useState('0.00');
  const [userBalanceAdjusted, setUserBalanceAdjusted] = useState('0.00');
  const contract = useStakingContract(type)
  const { data: signer } = useSigner()
  const toast = useToast()
  const getUserBalance = useCallback((async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const depositID = await contract.userDepositId(signer.getAddress())

      // const currDeposits = await contract.userCurrentDeposits(
      //   signer.getAddress()
      // );
      let amount = BigInt(0);
      for (let index = 1; index <= BigInt(depositID); index++) {
        const result = await contract.userActiveDeposits(
          signer.getAddress(),
          index
        );

        if (result) {
          const result = await contract.userInfo(signer.getAddress(), index);
          amount = amount + BigInt(result["amount"]);
        }
      }
      let amountAdjusted = BigInt(0);
      var seconds = new Date().getTime() / 1000;
      for (let index = 1; index <= BigInt(depositID); index++) {
        const result = await contract.userActiveDeposits(
          signer.getAddress(),
          index
        );
        if (result) {
          const result = await contract.userInfo(signer.getAddress(), index);

          if (seconds - result["depositTimestamp"] > 15724800) {
            amountAdjusted = amountAdjusted + (BigInt(result["amount"]) / BigInt(100)) * BigInt(250);
          }
          else if (seconds - result["depositTimestamp"] > 7257600) {
            amountAdjusted = amountAdjusted + (BigInt(result["amount"]) / BigInt(100)) * BigInt(150);
          } else {
            amountAdjusted = amountAdjusted + BigInt(result["amount"]);
          }
        }
      }
      const userBalance = formatDisplayBalance(formatEther(amount).toString(), 6);
      const userBalanceAdjusted = formatDisplayBalance(formatEther(amountAdjusted).toString(), 6);
      setUserBalance(userBalance)
      setUserBalanceAdjusted(userBalanceAdjusted)
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }), [signer]);
  useEffect(() => {
    getUserBalance()
  }, [contract, signer])
  return { userBalance, userBalanceAdjusted, getUserBalance }
}

export const useAvailableAmount = (type: string) => {
  const [availableAmount, setAvailableAmount] = useState(0);
  const contract = useWeaveBusdContract(type);
  const { data: signer } = useSigner()
  const toast = useToast();
  const getAvailableAmount = useCallback((async () => {
    if (!contract || !contract) {
      return
    }
    try {
      const amount = await contract.balanceOf(
        signer?.getAddress()
      );
      setAvailableAmount(formatEther(amount));
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }), [signer]);
  useEffect(() => {
    getAvailableAmount()
  }, [contract, signer])

  return { availableAmount, getAvailableAmount }
}

export const useWeaveTVL = (type: string) => {
  const [weaveTVL, setWeaveTVL] = useState('0.00');
  const [weaveTVLAdjusted, setWeaveTVLAdjusted] = useState('0.00');
  const contract = useStakingContract(type)
  const weaveBusdContract = useWeaveBusdContract(type)
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !weaveBusdContract) {
        return
      }
      try {
        const amount = await contract.adjTokenDepositedAmount()
        const tokenAmount = await weaveBusdContract.balanceOf(
          config[type].stakingContractAddressv2
        );

        const weaveTVLAdjusted = formatDisplayBalance(formatEther(amount).toString(), 2);
        const weaveTVL = formatDisplayBalance(formatEther(tokenAmount).toString(), 2);
        setWeaveTVLAdjusted(weaveTVLAdjusted)
        setWeaveTVL(weaveTVL)
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }

    fetchData()
  }, [contract, weaveBusdContract])

  return { weaveTVL, weaveTVLAdjusted }
}

export const useWeaveSingleAPY = async (type: string) => {
  const [weaveSingleAPY, setWeaveSingleAPY] = useState('0.00');
  const contract = useStakingContract(type)
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!contract) {
        return
      }
      try {
        const totalWeavePerSecond = await contract.tokenRewardsPerSecond();
        const totalWeavePerDay = BigInt(totalWeavePerSecond) * BigInt(3600) * BigInt(24);
        const TVL = await contract.adjTokenDepositedAmount();
        /* const step1 = totalWeavePerDay.div(ethers.BigNumber.from(TVL));
        const step2 = step1.mul(7).add(1);
        const step3 = step2.pow(52);
        const step4 = step3.sub(1).mul(100); */
        // const apy = (Math.pow(1 + (7 * 4999.15289722) / 3397442.89, 52) - 1) * 100;

        const calculatedAPY = (Math.pow(1 + (7 * Number(totalWeavePerDay)) / Number(TVL), 52) - 1) * 100;
        setWeaveSingleAPY(formatDisplayBalance(calculatedAPY?.toString(), 2))
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchData()
  }, [contract])

  return { weaveSingleAPY }
}

export const useBusdPrice = () => {
  const [busdPrice, setBusdPrice] = useState('0.00');
  const contract = useBusdContract()
  const toast = useToast()
  useEffect(() => {
    const fetchData = async () => {
      if (!contract) {
        return
      }
      try {
        const price = await contract.balanceOf(config["lp"].weaveAddress);
        setBusdPrice(utils.formatUnits(price))
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchData()
  }, [contract])

  return { busdPrice }
};

export const useLPTokenPrice = () => {
  const [lpTokenPrice, setLPTokenPrice] = useState('0.00');
  const contract = useWeaveLPContract()
  const busdContract = useBusdContract()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !busdContract) {
        return
      }
      try {
        const busdPrice = await busdContract.balanceOf(config["lp"].weaveAddress);
        const totalSupply = Number(await contract.totalSupply());
        const totalAmount = Number((busdPrice) * 2);
        setLPTokenPrice((totalAmount / totalSupply).toFixed(2))
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchData()
  }, [contract, busdContract])

  return { lpTokenPrice }
};

export const useWeavePrice = () => {
  const [weavePrice, setWeavePrice] = useState('0.00');
  const contract = useWeaveContract()
  const busdContract = useBusdContract()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !busdContract) {
        return
      }
      try {
        const busdPrice = await busdContract.balanceOf(config["lp"].weaveAddress);
        const weaveAmount = await contract.balanceOf(config["lp"].weaveAddress);
        const weavePrice = Number(busdPrice) / Number(weaveAmount);
        setWeavePrice(weavePrice?.toFixed(2));
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
        }
      }
    }

    fetchData()
  }, [contract, busdContract])

  return { weavePrice }
};

export const useWeaveLPAPR = (type: string) => {
  const [apr, setApr] = useState('0.00')
  const toast = useToast()
  const weaveContract = useWeaveContract()
  const busdContract = useBusdContract()
  const contract = useStakingContract(type)

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !weaveContract || !busdContract) {
        return
      }
      try {
        const weaveAmount = await weaveContract.balanceOf(config["lp"].weaveAddress);
        const busdPrice = await busdContract.balanceOf(config["lp"].weaveAddress);
        const weavePrice = Number(busdPrice) / Number(weaveAmount);
        const LpPrice = (Number(utils.formatUnits(busdPrice)) * 2) / 2437450;
        let seconds = new Date().getTime() / 1000;

        const totalWeavePerSecond = await contract.tokenRewardsPerSecond();
        let totalWeavePerDay = BigInt(totalWeavePerSecond) * BigInt(3600) * BigInt(24);
        if (seconds < 1643673600) {
          const bounsTokenPerSecond = await contract.bonusTokenRewardsPerSecond();
          const bounsTokenPerDay = BigInt(bounsTokenPerSecond) * BigInt(3600) * BigInt(24);
          totalWeavePerDay = totalWeavePerDay + bounsTokenPerDay;
        }
        const TVL = await contract.adjTokenDepositedAmount();
        // const calculatedAPY = (Math.pow(1 + (7 * Number(totalWeavePerDay)) / Number(TVL), 52) - 1) * 100;
        const apr = ((Number(weavePrice) * Number(totalWeavePerDay)) / (Number(TVL) * Number(LpPrice))) * 365 * 100;
        setApr(apr?.toFixed(2));
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchData()
  }, [contract, busdContract, weaveContract])

  return { apr }
}

export const useWeavePerDay = (type: string) => {
  const [userTokenPerDay, setUserTokenPerDay] = useState('0.00')
  const toast = useToast()
  const contract = useStakingContract(type)

  useEffect(() => {
    const fetchData = async () => {
      if (!contract) {
        return
      }
      try {
        const weaveps = await contract.getTokenRewardsPerDepositedUnit();
        const weavepcparsed = formatEther(weaveps);
        const userTokenPerDay = Number(weavepcparsed) * 60 * 60 * 24;
        setUserTokenPerDay(userTokenPerDay?.toFixed(6));
      } catch (error: any) {
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchData()
  }, [contract])

  return { userTokenPerDay }
}

export const useWeaveRewards = async (type: string) => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const contract = useStakingContract(type)
  if (!contract || !signer) {
    return
  }
  try {

    const depositID = await contract.userDepositId(signer.getAddress());

    const tokenRewardsPerUnit = await contract.getTokenRewardsPerDepositedUnit();
    let bonusTokenRewardsPerUnit = 0;
    if (type === "lp") {
      bonusTokenRewardsPerUnit = await contract.getBonusTokenRewardsPerDepositedUnit();
    }

    let amount = 0;
    for (let index = 1; index <= BigInt(depositID); index++) {
      const result = await contract.userActiveDeposits(
        signer.getAddress(),
        index
      );

      if (result) {
        const result = await contract.userInfo(signer.getAddress(), index);

        var seconds = new Date().getTime() / 1000;
        const reward = (seconds - Number(result["lastTimestampClaimed"])) * Number(formatEther(tokenRewardsPerUnit)) * Number(formatEther(result["amount"]));

        if (seconds - result["depositTimestamp"] > 15724800) {
          amount = amount + Number(reward) * 2.5;
        }
        else if (seconds - result["depositTimestamp"] > 7257600) {
          amount = amount + Number(reward) * 1.5;
        } else {
          amount = amount + Number(reward);
        }
        if (type === "lp") {
          let bonusTime = 0;
          if (Number(result["lastTimestampClaimed"]) < 1643673600) {
            if (seconds > 1643673600) {
              bonusTime = 1643673600 - Number(result["lastTimestampClaimed"]);
            } else {
              bonusTime = seconds - Number(result["lastTimestampClaimed"]);
            }
            const bonusReward = bonusTime * Number(formatEther(bonusTokenRewardsPerUnit)) * Number(formatEther(result["amount"]));
            amount = amount + bonusReward;
          }
        }
      }
    }

    return amount;
  } catch (error: any) {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        ...TOAST_OPTOPNS
      });
      return
    }
  }
}

export const useAutoCompoundSetWeave = async (type: string) => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const contract = useStakingContract(type)
  if (!contract || !signer) {
    return
  }
  try {
    const result = await contract.autoCompound(signer.getAddress());
    return result;
  } catch (error: any) {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        ...TOAST_OPTOPNS
      });
      return
    }
  }
}

export const useCheckApproval = (type: string) => {
  const [isApproval, setIsApproval] = useState(false);
  const { data: signer } = useSigner()
  const contract = useWeaveBusdContract(type)
  const toast = useToast()
  const checkApproval = useCallback((async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const transaction = await contract.allowance(
        signer.getAddress(),
        config[type].stakingContractAddressv2
      );
      if (transaction > 0) {
        setIsApproval(true)
      } else {
        setIsApproval(false)
      }
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }), [signer]);
  useEffect(() => {
    checkApproval()
  }, [contract])

  return { isApproval, checkApproval }
};

export const useApproveWeave = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useWeaveContract();
  const stakingContractAddress = useStakingContract(type)?.address;
  const approveWeave = useCallback(async () => {
    if (!contract || !signer) {
      return;
    }
    try {
      const tx = await contract.approve(
        stakingContractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
      await tx.wait();
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return;
      }
    }
  }, [contract]);
  return approveWeave;
}

export const useDepositWeave = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);

  const deposit = useCallback(async (depositAmount: number) => {
    if (!contract || !signer || !depositAmount || depositAmount < 0) {
      return
    }
    try {
      const tx = await contract.deposit(
        signer.getAddress(),
        formatAmount(depositAmount)
      );
      await tx.wait();
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }, [contract]);
  return deposit;
}

export const useWithdrawWeave = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);

  const withdraw = useCallback(async (weaveToWithdraw: number, weaveDeposited: number) => {
    if (!contract || !signer || !weaveToWithdraw || weaveToWithdraw < 0) {
      return
    }
    try {
      if (weaveToWithdraw == weaveDeposited) {
        // max withdraw
        if (signer) {
          const depositID = await contract.userDepositId(signer.getAddress());
          const depositIds: Number[] = [];
          for (let index = 1; index <= depositID; index++) {
            const userActiveDeposits = await contract.userActiveDeposits(
              signer.getAddress(),
              index
            );
            if (userActiveDeposits == true) {
              depositIds.push(index);
            }
          }
          const tx = await contract.withdraw(depositIds);
          await tx.wait();
        }
      } else {
        if (signer) {
          const depositID = await contract.userDepositId(signer.getAddress());
          let amount = ethers.BigNumber.from(0);
          let lastAmount = ethers.BigNumber.from(0);
          let getOut = ethers.BigNumber.from(
            ethers.utils.parseEther(weaveToWithdraw.toString())
          );
          let amountLeftToWithdraw = getOut;
          let depositIds: Number[] = [];
          let index = ethers.BigNumber.from(depositID).toNumber();
          for (index; index > 0; index--) {
            const userActiveDeposits = await contract.userActiveDeposits(
              signer.getAddress(),
              index
            );
            if (userActiveDeposits == true) {
              const result = await contract.userInfo(signer.getAddress(), index);
              amount = amount.add(result["amount"]);
              depositIds.push(Number(index));
              if (getOut.eq(amount)) {
                await contract.withdraw(depositIds);
                break;
              } else if (getOut.lt(amount)) {
                if (depositIds.length > 1) {
                  const test = amount.sub(getOut);
                  const test2 = ethers.BigNumber.from(result["amount"]).sub(test);
                  await contract.withdrawDeposits(depositIds, test2);
                  break;
                } else if (depositIds.length == 1) {
                  await amount.sub(getOut);
                  await contract.partialWithdraw(depositIds[0], getOut);
                  break;
                }
              }
              amountLeftToWithdraw.sub(result["amount"]);
              lastAmount.add(BigInt(result["amount"]));
            }
          }
        }
      }
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }, [contract]);
  return withdraw;
};

export const useCompoundAll = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);
  const compoundAll = useCallback(async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const depositID = await contract.userDepositId(signer.getAddress());
      const depositIds: Number[] = [];
      for (let index = 1; index <= depositID; index++) {
        const userActiveDeposits = await contract.userActiveDeposits(
          signer.getAddress(),
          index
        );
        if (userActiveDeposits == true) {
          const result = await contract.userInfo(signer.getAddress(), index);
          let seconds = new Date().getTime() / 1000;
          if (result["timelockTimestamp"] < seconds) {
            depositIds.push(index);
          }
        }
      }
      if (depositIds.length > 0) {
        await contract.claimInterest(depositIds, true);
      }
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }, [contract]);
  return compoundAll;
}

export const useClaimAll = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);
  const claimAll = useCallback(async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const depositID = await contract.userDepositId(signer.getAddress());
      const depositIds: Number[] = [];
      for (let index = 1; index <= depositID; index++) {
        const userActiveDeposits = await contract.userActiveDeposits(
          signer.getAddress(),
          index
        );
        if (userActiveDeposits == true) {
          const result = await contract.userInfo(signer.getAddress(), index);
          let seconds = new Date().getTime() / 1000;
          if (result["timelockTimestamp"] < seconds) {
            depositIds.push(index);
          }
        }
      }
      if (depositIds.length > 0) {
        await contract.claimInterest(depositIds, false);
      }
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }, [contract]);
  return claimAll;
}

export const useToggleAutoCompound = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);
  const toggleAutoCompound = useCallback(async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const tx = await contract.toggleAutoCompound();
      await tx.wait();
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }, [contract]);
  return toggleAutoCompound;
}

export const useIsAutoCompound = (type: string) => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useStakingContract(type);
  const [isAutoCompound, setIsAutoCompound] = useState(false);
  const getIsCompound = useCallback((async () => {
    if (!contract || !signer) {
      return
    }
    try {
      const result = await contract.autoCompound(signer.getAddress());
      setIsAutoCompound(result);
    } catch (error: any) {
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          ...TOAST_OPTOPNS
        });
        return
      }
    }
  }), [contract]);
  useEffect(() => {
    getIsCompound()
  }, [contract]);
  return { isAutoCompound, getIsCompound };
}

export const useWithdrawFees = () => {
  const toast = useToast();
  const { data: signer } = useSigner();
  const contract = useFeeContract();
  const withdrawFees = useCallback(async () => {
    if (!signer || !contract) {
      return;
    }
    const userAddress = await signer.getAddress();
    const index = signerArray.findIndex((x: any) => x._address === userAddress);
    if (index > -1) {
      const leafNode = getLeafNode(
        signerArray[index] as any,
        bigAmountArray[index] as any,
        1
      );
      const result = await contract.claimed(1, leafNode);
      if (!result) {
        const merkleTree = getMerkleTree(
          signerArray as any,
          bigAmountArray as any,
          1
        );
        const merkleProof = merkleTree.getHexProof(leafNode);
        try {
          await contract.claim(
            userAddress,
            bigAmountArray[index],
            merkleProof
          );
        } catch (error: any) {
          if (error) {
            toast({
              title: 'Error',
              description: error.message,
              status: 'error',
              ...TOAST_OPTOPNS
            });
            return
          }
        }
      }
    }
  }, [contract])
  return withdrawFees;
};