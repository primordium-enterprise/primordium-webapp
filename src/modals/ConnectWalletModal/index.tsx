'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button } from "@nextui-org/react";
import { createContext } from "react";
import { useConnect } from "wagmi";

// export enum WalletType

export const ConnectWalletModalContext = createContext<ReturnType<typeof useDisclosure> | any>({});

export default function ConnectWalletModal({
  children
}: {
  children: React.ReactNode
}) {

  const disclosure = useDisclosure();

  const { isOpen, onOpen, onOpenChange } = disclosure;

  const { connectors } = useConnect();

  console.log(connectors);

  return (
    <>
      <ConnectWalletModalContext.Provider value={disclosure}>
        {children}
      </ConnectWalletModalContext.Provider>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            {connectors.map(connector => (
              <Button key={connector.uid}>{connector.name}</Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}