import {
  Box,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { RiAlertFill } from 'react-icons/ri';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="300px" h="250px">
        <ModalCloseButton />
        <ModalBody
          d="flex"
          flexDirection="column"
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Box as={RiAlertFill} w="100px" h="100px" color="#E53E3E" />
          <Text fontSize="18px" fontWeight="bold">
            Arquivo com formato inválido!!
          </Text>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
