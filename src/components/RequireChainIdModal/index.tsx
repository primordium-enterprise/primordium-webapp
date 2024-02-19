"use client";

import { defaultChain } from "@/config/wagmi-config";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect, useMemo } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

export default function RequireChainIdModal() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const wagmiChainId = useChainId();
  const { selectedNetworkId } = useWeb3ModalState();

  const chainId = useMemo(() => {
    return selectedNetworkId || wagmiChainId;
  }, [wagmiChainId, selectedNetworkId]);

  const { switchChain, error, isError, isPending } = useSwitchChain();

  const wrongNetworkDetected = useMemo(() => {
    if (!isConnected && chainId !== defaultChain.id) {
      switchChain({ chainId: defaultChain.id });
    }
    return isConnected && chainId !== defaultChain.id;
  }, [chainId, isConnected]);

  useEffect(() => {
    if (!isConnected && chainId !== defaultChain.id) {
      switchChain({ chainId: defaultChain.id });
    }
  }, [chainId, isConnected]);

  useEffect(() => {
    if (error) {
      console.log("Failed to switch chains:", error);
    }
  }, [error]);

  return (
    <Modal
      isOpen={wrongNetworkDetected}
      isDismissable={false}
      hideCloseButton
      backdrop="opaque"
      className="text-sm sm:text-base"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="px-2 sm:px-6">Wrong Network Detected</ModalHeader>
        <ModalBody className="p-2 text-sm sm:p-6 sm:text-lg">
          <p>
            This app uses the {defaultChain.name} {defaultChain.testnet ? "test " : " "}network{" "}
            {`(with a chain ID of ${defaultChain.id}).`}
          </p>
          <Button
            className="m-4"
            color="primary"
            onPress={() => switchChain({ chainId: defaultChain.id })}
            isLoading={isPending}
            isDisabled={isError}
          >
            Switch to {defaultChain.name}
          </Button>
          {isError && (<>
            <p className="m-4 text-warning text-base">
              Failed to switch networks. To proceed, please manually open your wallet and switch to
              the {defaultChain.name} network. Or, select a network from below:
            </p>
            <Button
              className="m-4"
              color="primary"
              onPress={() => open({ view: "Networks" })}
            >
              Select Network
            </Button>
          </>)}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
