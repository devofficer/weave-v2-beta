import { useState } from 'react';
import dynamic from 'next/dynamic'
import { Contract, utils } from 'ethers';
import { Flex, Text, useToast } from '@chakra-ui/react';
import RouterABI from 'config/ABI/RouterABI.json';
import { TOAST_OPTOPNS } from 'config';
import { useWeb3React } from 'hooks/useWeb3React';
import { createWallet } from 'utils/walletHelpers';
import { ChainId } from 'utils/chains';
const Button = dynamic(() => import('components/common/Button'))

const GetTestToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const { account, chainId, provider } = useWeb3React()
  const toast = useToast()

  // Get test BNB in weave testnet
  const getFundsBnB = () => {
    setActiveButton('funds_bnb')
    setIsLoading(true)
    // Sender private key:
    // correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    // Create a wallet instance
    const wallet = createWallet(privateKey, provider)
    // Ether amount to send
    const amountInEther = "1";
    // Create a transaction object
    if (!account) {
      return
    }
    const tx = {
      to: account,
      value: utils.parseEther(amountInEther),
    };

    try {
      // Send a transaction
      wallet.sendTransaction(tx).then((txObj) => {
        toast({
          title: 'Transaction Successfully',
          description: "You funded 1 BNB in Weave Testnet.",
          status: 'success',
          ...TOAST_OPTOPNS
        });
        console.log("txHash", txObj.hash);
        setIsLoading(false)
        // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
        // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }

  };

  //Get test BUSD in weave testnet
  const getFundsBusd = async () => {
    setActiveButton('funds_busd')
    setIsLoading(true)
    // Sender private key:
    // correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    // Create a wallet instance
    const wallet = createWallet(privateKey, provider)
    try {
      // Receiver Address which receives Ether
      // const contract = new Contract(
      //   "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      //   [
      //     "function approve(address _spender, uint256 _value) public returns (bool success)",
      //   ],
      //   wallet
      // );
      // const transaction = await contract.approve(
      //   "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      //   "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      // );

      const masterRouter = new Contract(
        "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        RouterABI,
        wallet
      );
      /* const swapResult = await masterRouter.swapExactTokensforTokens(ethers.utils.parseEther('1') , ethers.utils.parseEther('0') , ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'], userAddress, 0); */
      const tx2 = await masterRouter.swapExactETHForTokens(
        0,
        [
          "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        ],
        account,
        Date.now() + 1000 * 60 * 10,
        {
          gasPrice: provider.getGasPrice(),
          gasLimit: 310000,
          value: utils.parseEther("1"),
        }
      );
      const receipt = await tx2.wait();
      if (receipt) {
        toast({
          title: 'Transaction Successfully',
          description: "You funded BUSD in Weave Testnet.",
          status: 'success',
          ...TOAST_OPTOPNS
        });
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  };

  return (
    <Flex flexDir={'column'}>
      <Text py={2}>In Beta mode we only support testing tokens that you can access from our faucet.</Text>
      {chainId === ChainId.WEAVE_TESTNET &&
        <Flex gap={2} justifyContent={'flex-end'}>
          <Button label={'Get Fund BNB'} onClick={getFundsBnB} fontSize="sm" isLoading={(activeButton === 'funds_bnb' && isLoading)} />
          <Button label={'Get Fund BUSD'} onClick={getFundsBusd} fontSize="sm" isLoading={(activeButton === 'funds_busd' && isLoading)} />
        </Flex>
      }
    </Flex>
  );
};

export default GetTestToken;
