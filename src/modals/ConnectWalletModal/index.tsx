'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { createContext } from "react";

export const ConnectWalletModalContext = createContext<ReturnType<typeof useDisclosure> | any>({})

export default function ConnectWalletModal({
  children
}: {
  children: React.ReactNode
}) {

  const disclosure = useDisclosure();

  const { isOpen, onOpen, onOpenChange } = disclosure;

  return (
    <>
      <ConnectWalletModalContext.Provider value={disclosure}>
        {children}
      </ConnectWalletModalContext.Provider>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            Testing Testing 123
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}