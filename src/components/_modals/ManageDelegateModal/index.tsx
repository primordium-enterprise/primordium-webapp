"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useModalState } from "../ModalManagerProvider";
import { useAccount } from "wagmi";
import { useQuery } from "urql";
import { MemberQuery } from "@/subgraph/subgraphQueries";
import useFormattedMushiBalance from "@/hooks/useFormattedMushiBalance";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

export const MANAGE_DELEGATE_MODAL = "ManageDelegateModal";

export default function ManageDelegateModal() {
  const { isOpen, onOpenChange, close } = useModalState(MANAGE_DELEGATE_MODAL);
  const { open: openWeb3Modal } = useWeb3Modal();
  const { open: isWeb3ModalOpen } = useWeb3ModalState();

  const { address } = useAccount();

  const [result] = useQuery({ query: MemberQuery, variables: { id: address }, pause: !isOpen });
  const { data, fetching, error } = result;

  const {
    value: mushiBalance,
    formatted: formattedMushiBalance,
    queryResult: { isLoading: isMushiBalanceLoading },
  } = useFormattedMushiBalance({ address });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      isDismissable={!isWeb3ModalOpen}
    >
      <ModalContent>
        <ModalHeader className="font-londrina-solid text-xl sm:text-3xl">
          Delegate Your Votes
        </ModalHeader>
        <ModalBody>
          <p className="text-2xs xs:text-xs sm:text-sm">
            PrimordiumDAO votes are represented by delegated MUSHI tokens. MUSHI holders may
            delegate their votes to themselves or any other address they choose.
          </p>
          <div className="my-2">
            {isMushiBalanceLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : mushiBalance > 0 ? (
              <>
                <Input
                  label="Your MUSHI votes balance:"
                  labelPlacement="inside"
                  isReadOnly
                  classNames={{
                    inputWrapper: "!bg-default-100"
                  }}
                  value={formattedMushiBalance}
                  endContent={<span className="text-sm text-foreground-500">MUSHI</span>}
                />
                <Input
                  label="Currently delegated to:"
                  className="mt-4"
                  classNames={{
                    inputWrapper: "!bg-default-100"
                  }}
                  labelPlacement="inside"
                  isReadOnly
                  value={"test"}
                />
              </>
            ) : address ? (
              <>
                <p className="mb-2 text-foreground-500">You currently have no votes to delegate.</p>
                <div className="flex justify-end">
                  <Button onPress={close}>Close</Button>
                </div>
              </>
            ) : (
              <Button onPress={() => openWeb3Modal()} color="primary">
                Connect Wallet
              </Button>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
