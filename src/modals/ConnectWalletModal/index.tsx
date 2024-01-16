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
import { useChainId, useConnect, useConnections } from "wagmi";
import walletConnectLogo from "public/wallet-brand-assets/walletconnect-logo.svg";
import braveLogo from "public/wallet-brand-assets/brave.svg";

export enum WALLET_TYPE {
  walletconnect = "walletConnect",
}

export const ConnectWalletModalContext = createContext<
  ReturnType<typeof useDisclosure> | any
>({});

const logo = (walletType: string) => {
  switch (walletType) {
    case "walletConnect":
      return walletConnectLogo;
    case "com.brave.wallet":
      return braveLogo;
    default:
      return "";
  }
};

export default function ConnectWalletModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const disclosure = useDisclosure();

  const { isOpen, onOpen, onOpenChange } = disclosure;

  const { connectors, connect } = useConnect();
  const connections = useConnections();
  const chainId = useChainId();

  console.log(connections);

  return (
    <>
      <ConnectWalletModalContext.Provider value={disclosure}>
        {children}
      </ConnectWalletModalContext.Provider>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            {connectors.map((connector) => {
              const icon = logo(connector.id) || connector.icon;
              return (
                <Button
                  key={connector.uid}
                  className="flex justify-start content-center"
                  onClick={() => connect({ connector })}
                >
                  {icon && (
                    <Image
                      className="w-6"
                      src={icon}
                      alt="Wallet icon"
                      width="64"
                      height="64"
                    />
                  )}
                  {connector.name}
                </Button>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
