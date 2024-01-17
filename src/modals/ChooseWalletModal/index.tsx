"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import { createContext } from "react";
import { useAccount, useChainId, useConnect, useConnections } from "wagmi";
import WalletOption from "./WalletOption";

export const ChooseWalletModalContext = createContext<ReturnType<typeof useDisclosure> | any>({});

export default function ChooseWalletModal({ children }: { children: React.ReactNode }) {
  const disclosure = useDisclosure();

  const { isOpen, onOpenChange } = disclosure;

  const { connector: currentConnector } = useAccount();
  const useConnectReturn = useConnect();
  const { connectors, isPending, reset } = useConnectReturn;

  return (
    <>
      <ChooseWalletModalContext.Provider value={disclosure}>
        {children}
      </ChooseWalletModalContext.Provider>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            {connectors.map((connector) => (
              <WalletOption
                key={connector.uid}
                connector={connector}
                currentConnector={currentConnector}
                useConnectReturn={useConnectReturn}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              isDisabled={!isPending}
              onPress={() => reset()}
            >
              Cancel
            </Button>
            <Button color="primary">Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
