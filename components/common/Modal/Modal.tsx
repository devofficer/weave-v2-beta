import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { IModalProps } from 'types';

const Modal = ({ children, onClose, isOpen, title, footer, size, hiddenCloseBtn, ...rest }: IModalProps) => {
  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} isCentered size={size} blockScrollOnMount={false} {...rest}>
      <ModalOverlay backdropFilter='blur(10px)' />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {!hiddenCloseBtn &&
          <ModalCloseButton />
        }
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          {footer}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal;