"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useModalState } from "../ModalManagerProvider";
import { useAccount, useEnsAddress } from "wagmi";
import { useQuery } from "urql";
import { DelegateQuery, MemberQuery } from "@/subgraph/subgraphQueries";
import useFormattedMushiBalance from "@/hooks/useFormattedMushiBalance";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useMemo, useState } from "react";
import { Address, isAddress, isAddressEqual } from "viem";
import shortenAddress from "@/utils/shortenAddress";
import { CopyIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { normalize } from "viem/ens";
import { defaultChain } from "@/config/wagmi-config";
import { foundry, mainnet } from "viem/chains";

export const MANAGE_DELEGATE_MODAL = "ManageDelegateModal";

export default function ManageDelegateModal() {
  const { isOpen, onOpenChange, close } = useModalState(MANAGE_DELEGATE_MODAL);
  const { open: openWeb3Modal } = useWeb3Modal();
  const { open: isWeb3ModalOpen } = useWeb3ModalState();

  const { address } = useAccount();

  const [result] = useQuery({ query: MemberQuery, variables: { id: address }, pause: !isOpen });
  const { data: memberData, fetching, error } = result;

  const delegate: Address | "" = useMemo(() => {
    if (memberData && memberData.delegate) {
      return memberData.delegate.id as Address;
    }
    return "";
  }, [memberData]);

  const currentDelegateDisplay: JSX.Element | null = useMemo(() => {
    if (!address || delegate === "") {
      return null;
    } else if (isAddressEqual(delegate, address)) {
      return (
        <span>
          <i>Yourself</i>
        </span>
      );
    } else {
      return (
        <div className="align-center flex justify-between">
          <span>{shortenAddress(delegate || "0x1231231231231231231231231231231111111113")}</span>
          <CopyIcon
            className="hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(delegate);
              toast.success("Copied address to clipboard!", { duration: 5000 });
            }}
          />
        </div>
      );
    }
  }, [delegate, address]);

  const {
    value: mushiBalance,
    formatted: formattedMushiBalance,
    queryResult: { isLoading: isMushiBalanceLoading },
  } = useFormattedMushiBalance({ address });

  const [isUpdatingDelegate, setIsUpdatingDelegate] = useState(false);
  const [newDelegateValue, setNewDelegateValue] = useState("");
  const startUpdatingDelegate = (delegateToSelf: boolean = false) => {
    if (delegateToSelf && address) {
      setNewDelegateValue(address);
    }
    setIsUpdatingDelegate(true);
  };

  const ensName = useMemo(() => {
    if (newDelegateValue.endsWith(".eth")) {
      try {
        let normalized = normalize(newDelegateValue);
        return normalized;
      } catch (err) {
        console.log(err);
      }
    }
    return undefined;
  }, [newDelegateValue]);

  const {
    data: newDelegateEnsAddress,
    isLoading: isEnsLoading,
    error: isEnsError,
  } = useEnsAddress({
    name: ensName, // undefined sets "enabled" to false for query
    chainId: defaultChain.id === foundry.id ? mainnet.id : defaultChain.id
  });

  const isNewDelegateValueValid = useMemo(() => {
    return ensName || newDelegateValue === "null" || isAddress(newDelegateValue);
  }, [newDelegateValue, ensName]);

  const newDelegateAddress = !!ensName
    ? isEnsLoading && !isEnsError
      ? undefined
      : newDelegateEnsAddress
    : isNewDelegateValueValid
      ? newDelegateValue
      : undefined;

  if (newDelegateAddress) {
    console.log(newDelegateAddress);
  }

  const [delegateResult] = useQuery({
    query: DelegateQuery,
    variables: { id: newDelegateAddress },
    pause: !!ensName || !isNewDelegateValueValid,
  });

  const newDelegateLoading = true;

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
              isUpdatingDelegate ? (
                <>
                  <p>
                    Enter the address or ENS name of the account you want to delegate to. Enter
                    "null" if you would like to un-delegate your votes.
                  </p>
                  <Input
                    value={newDelegateValue}
                    onValueChange={setNewDelegateValue}
                    placeholder="0x... or ...eth"
                    isInvalid={newDelegateValue.length > 0 && !isNewDelegateValueValid}
                    endContent={
                      <Spinner size="sm" style={{ opacity: newDelegateLoading ? "100" : "0" }} />
                    }
                  />
                </>
              ) : (
                <>
                  {currentDelegateDisplay ? (
                    <>
                      <div className="text-sm">Delegating {formattedMushiBalance} votes to:</div>
                      <Card>
                        <CardBody className="bg-default-100 text-center">
                          {currentDelegateDisplay}
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Button
                        color="primary"
                        className="mt-2"
                        fullWidth
                        onPress={() => startUpdatingDelegate(true)}
                      >
                        Delegate to Yourself
                      </Button>
                    </>
                  )}
                  <Button
                    color="primary"
                    className="mt-2"
                    fullWidth
                    onPress={() => startUpdatingDelegate()}
                  >
                    Update Delegate
                  </Button>
                </>
              )
            ) : address ? (
              <>
                <p className="text-foreground-500">You currently have no votes to delegate.</p>
                <div className="mt-2 flex justify-end">
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
