import { ButtonProps, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Tips from '../config/tips';

const Button = dynamic(() => import('./common/Button'));
const Modal = dynamic(() => import('./common/Modal'));
const WalletConnect = dynamic(() => import('./WalletConnect'));
const WeaveyHelper = dynamic(() => import('./common/WeaveyHelper'));

const WalletConnectButton = ({ ...rest }: ButtonProps) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <WeaveyHelper tip={Tips.TIP_BUTTON_CONNECT_WALLET}>
        <Button label={'Connect Wallet'} value={2} onClick={onOpen} {...rest} />
      </WeaveyHelper>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        title="Select Wallet"
        size={'xs'}
      >
        <WalletConnect onClose={onClose} />
      </Modal>
    </>
  )
}

export default WalletConnectButton;