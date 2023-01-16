import dynamic from 'next/dynamic'
import { Flex, Text } from "@chakra-ui/react";
import Modal from 'components/common/Modal';
import { useAvailableAmount, useDepositWeave, useUserBalance, useWithdrawWeave } from 'hooks/useStake';
import { useEffect, useState } from 'react';
const Button = dynamic(() => import('components/common/Button'));
const NumberInput = dynamic(() => import('components/common/Input/NumberInput'));

const ModalAmountInput = ({ type, action, onClose, isOpen }:
  {
    type: string;
    action: string,
    onClose: any
    isOpen: boolean
  }) => {

  const { availableAmount, getAvailableAmount } = useAvailableAmount(type);
  const { userBalance, getUserBalance } = useUserBalance(type)
  const deposit = useDepositWeave(type);
  const withdraw = useWithdrawWeave(type);
  const [amount, setAmount] = useState(0);
  const [invaildInput, setInvalidInput] = useState(false);
  const [maxInputAmount, setMaxInputAmount] = useState(0);

  useEffect(() => {
    setMaxInputAmount(action === 'deposit' ? availableAmount : Number(userBalance));
  }, [availableAmount, userBalance, action]);

  useEffect(() => {
    getUserBalance();
    getAvailableAmount();
  }, [action, getUserBalance, getAvailableAmount]);

  const handleAmountInput = (e: number) => {
    if (e > maxInputAmount) {
      setInvalidInput(true);
      return;
    }
    setInvalidInput(false);
    setAmount(e);
  }

  const handleAction = async () => {
    if (action === 'deposit') {
      await deposit(amount);
      onClose();
    }
    if (action === 'withdraw') {
      await withdraw(amount, Number(userBalance));
      onClose();
    }
    await getUserBalance();
    await getAvailableAmount();
    setAmount(0);
  }

  const title = action === 'deposit' ? 'Deposit' : 'Withdraw';

  return (
    <Modal
      onClose={() => {
        onClose();
        setAmount(0);
      }}
      isOpen={isOpen}
      title={title}
      size={'md'}
    >
      <Flex flexDirection={'column'} gap={3}>
        <Flex flexDirection={'row'}>
          <Button
            onClick={() => { setAmount(maxInputAmount) }}
            colorType='secondary'
            label={'Max'}
            size={'xs'}
          />
          <Text fontWeight={'600'}> {'\xa0\xa0\xa0\xa0\xa0' + maxInputAmount.toFixed(4)}</Text>
        </Flex>
        <NumberInput
          // leftIcon={
          //   <Flex justifyContent={'center'}>
          //     <Image
          //       width={32}
          //       height={32}
          //       src={WEAVE_TOKEN_ICON_URL}
          //       alt={'staking'}
          //     />
          //     <Image
          //       width={32}
          //       height={32}
          //       src={BSC_LOGO_URL}
          //       alt={'staking'}
          //     />
          //   </Flex>
          // }
          value={amount}
          isError={invaildInput}
          errorText={'Input amount exceeds user balance'}
          handleChange={handleAmountInput}
        />
        <Button label={title} onClick={handleAction} colorScheme="cyan" />
      </Flex>
    </Modal>
  );
}

export default ModalAmountInput;