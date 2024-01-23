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
import { createContext } from "react";
import { useAccount, useConnect } from "wagmi";
import WalletOption from "./WalletOption";

export const ChooseWalletModalContext = createContext<ReturnType<typeof useDisclosure>>(
  {} as ReturnType<typeof useDisclosure>,
);

export default function ChooseWalletModal({ children }: { children: React.ReactNode }) {
  const disclosure = useDisclosure();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const { connector } = useAccount();
  const useConnectReturn = useConnect();
  const { connectors, isPending } = useConnectReturn;

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
        backdrop={"blur"}
      >
        <ModalContent>
          <ModalHeader>Connect a Wallet</ModalHeader>
          <ModalBody>
            {connectors.map((connector) => (
              <WalletOption
                key={connector.uid}
                connector={connector}
                useConnectReturn={useConnectReturn}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              isDisabled={isPending || connector === undefined}
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
