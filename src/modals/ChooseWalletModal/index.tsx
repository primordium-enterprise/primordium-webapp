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

  const { isOpen, onOpenChange, onClose } = disclosure;

  const account = useAccount();
  const useConnectReturn = useConnect();
  const { connectors, isPending, reset } = useConnectReturn;

  // console.log(connectors);

  return (
    <>
      <ChooseWalletModalContext.Provider value={disclosure}>
        {children}
      </ChooseWalletModalContext.Provider>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={!isPending}
        hideCloseButton={isPending}
        backdrop={isPending ? "blur" : "opaque"}
      >
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            {connectors.map((connector) => (
              <WalletOption
                key={connector.uid}
                connector={connector}
                account={account}
                useConnectReturn={useConnectReturn}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              isDisabled={isPending || account.connector === undefined}
              onPress={() => onClose()}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
