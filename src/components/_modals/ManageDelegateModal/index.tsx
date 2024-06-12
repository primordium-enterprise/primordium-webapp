"use client";

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useModalState } from "../ModalManagerProvider";
import { useAccount, useChainId, useEnsAddress, useReadContract, useWriteContract } from "wagmi";
import { useQuery } from "urql";
import { DelegateQuery } from "@/subgraph/subgraphQueries";
import useFormattedMushiBalance from "@/hooks/useFormattedMushiBalance";
import { useContext, useEffect, useMemo, useState } from "react";
import { Address, isAddress, isAddressEqual } from "viem";
import shortenAddress from "@/utils/shortenAddress";
import { CopyIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { normalize } from "viem/ens";
import { foundry, mainnet } from "viem/chains";
import DisplayAddress from "@/components/DisplayAddress";
import abbreviateBalance from "@/utils/abbreviateBalance";
import chainConfig, { defaultChain } from "@/config/chainConfig";
import PrimordiumTokenV1Abi from "@/abi/PrimordiumTokenV1.abi";
import { ADDRESS_ZERO } from "@/utils/constants";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import handleViemContractError from "@/utils/handleViemContractError";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const MANAGE_DELEGATE_MODAL = "ManageDelegateModal";

export default function ManageDelegateModal() {
  const { isOpen, onOpenChange, close } = useModalState(MANAGE_DELEGATE_MODAL);
  const { openConnectModal } = useConnectModal();

  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const { addTransaction } = useContext(LocalTransactionsContext);

  // Read account's currentDelegateAddress from contract
  const {
    data: currentDelegateAddress,
    isLoading: isCurrentDelegateAddressLoading,
    isError: currentDelegateAddressError,
    refetch: refetchCurrentDelegateAddress,
  } = useReadContract({
    address: chainConfig.addresses.token,
    abi: PrimordiumTokenV1Abi,
    functionName: "delegates",
    args: [accountAddress as Address],
    query: { enabled: !!accountAddress && isOpen },
  });

  useEffect(() => {
    if (currentDelegateAddressError) {
      console.log(currentDelegateAddressError);
    }
  }, [currentDelegateAddressError]);

  // The display JSX element of the current delegate address (or null if no delegate)
  const currentDelegateDisplay: JSX.Element | null = useMemo(() => {
    if (!accountAddress || !currentDelegateAddress || currentDelegateAddress === ADDRESS_ZERO) {
      return null;
    } else if (isAddressEqual(currentDelegateAddress, accountAddress)) {
      return <span>Yourself</span>;
    } else {
      return (
        <div className="align-center flex justify-between">
          <span>
            {shortenAddress(currentDelegateAddress || "0x1231231231231231231231231231231111111113")}
          </span>
          <CopyIcon
            className="hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(currentDelegateAddress);
              toast.success("Copied address to clipboard!", { duration: 5000 });
            }}
          />
        </div>
      );
    }
  }, [currentDelegateAddress, accountAddress]);

  // The current account's MUSHI balance
  const {
    value: mushiBalance,
    formatted: formattedMushiBalance,
    queryResult: { isLoading: isMushiBalanceLoading },
  } = useFormattedMushiBalance({ address: accountAddress });

  // State for updating to a new delegate
  const [isUpdatingDelegate, setIsUpdatingDelegate] = useState(false);
  const [newDelegateValue, setNewDelegateValue] = useState("");
  const startUpdatingDelegate = (delegateToSelf: boolean = false) => {
    if (delegateToSelf && accountAddress) {
      setNewDelegateValue(accountAddress);
    }
    setIsUpdatingDelegate(true);
  };

  // Reset isUpdatingDelegate to false when exiting modal
  useEffect(() => {
    if (!isOpen) {
      setIsUpdatingDelegate(false);
    }
  }, [isOpen]);

  // Resolves to the normalized ENS name if the update input value is a valid ENS name, undefined otherwise
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

  // Loads the ENS address of a valid ENS name
  const {
    data: newDelegateEnsAddress,
    isLoading: isEnsLoading,
    error: isEnsError,
  } = useEnsAddress({
    name: ensName, // undefined sets "enabled" to false for query
    chainId: defaultChain.id === foundry.id ? mainnet.id : defaultChain.id,
  });

  // Tracks whether the input value is valid
  const isNewDelegateValueValid = useMemo(() => {
    return ensName || newDelegateValue === "null" || isAddress(newDelegateValue);
  }, [newDelegateValue, ensName]);

  // Will be "null" if the ENS name is valid, loaded, but no matching address is found
  const newDelegateAddress: Address | null | undefined = !!ensName
    ? isEnsLoading && !isEnsError
      ? undefined
      : newDelegateEnsAddress
    : isNewDelegateValueValid
      ? newDelegateValue === "null"
        ? ADDRESS_ZERO
        : (newDelegateValue as Address)
      : undefined;

  const [delegateResult] = useQuery({
    query: DelegateQuery,
    variables: { address: newDelegateAddress as Address },
    pause: !newDelegateAddress,
  });
  const {
    data: delegateData,
    fetching: isDelegateDataLoading,
    error: delegateDataError,
  } = delegateResult;

  // True if currently fetching data related to the inputted delegate value
  const delegateLoading = isEnsLoading || isDelegateDataLoading;

  // The formatted vote count of the loaded delegate, or "0"
  const delegateVotesDisplay = useMemo(() => {
    let votes = delegateData?.delegate?.delegatedVotesBalance;
    if (!votes) return "0";
    return abbreviateBalance(BigInt(votes), 18);
  }, [delegateData]);

  useEffect(() => {
    if (delegateDataError) {
      console.log(delegateDataError);
    }
  }, [delegateDataError]);

  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const sendUpdateDelegateTx = () => {
    if (!newDelegateAddress) {
      return toast.error("Invalid delegate address.");
    }
    const toastId = toast.loading("Creating transaction to update delegate...");
    let description = `Delegate votes to ${shortenAddress(newDelegateAddress)}${ensName ? ` (${ensName})` : newDelegateAddress === accountAddress ? `(Yourself)` : ""}.`;
    writeContractAsync({
      address: chainConfig.addresses.token,
      abi: PrimordiumTokenV1Abi,
      functionName: "delegate",
      args: [newDelegateAddress],
    })
      .then((hash) => {
        setIsUpdatingDelegate(false);
        setNewDelegateValue("");
        close();
        addTransaction(hash, description, toastId, () => {
          refetchCurrentDelegateAddress();
        });
      })
      .catch((error) => handleViemContractError(error, toastId));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="font-londrina-solid text-xl xs:text-3xl">
          {isUpdatingDelegate ? "Update Delegate" : "Delegate Your Votes"}
        </ModalHeader>
        <ModalBody className="pb-4">
          {!isUpdatingDelegate && (
            <p className="text-2xs xs:text-xs sm:text-sm">
              Primordium votes are represented by delegated $MUSHI tokens. $MUSHI holders may
              delegate their votes to themselves or any other address they choose.
            </p>
          )}
          <div>
            {isMushiBalanceLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : mushiBalance > 0 ? (
              isUpdatingDelegate ? (
                <>
                  <p className="text-2xs xs:text-xs sm:text-sm">
                    Enter the address or ENS name of the account you want to delegate to. Enter
                    {`"null"`} if you would like to un-delegate your votes.
                  </p>
                  <Input
                    className="mt-4"
                    classNames={{
                      input: "text-xs",
                    }}
                    label="Delegate to:"
                    value={newDelegateValue}
                    onValueChange={setNewDelegateValue}
                    variant="bordered"
                    placeholder="0x... or ...eth"
                    isInvalid={newDelegateValue.length > 0 && !isNewDelegateValueValid}
                    errorMessage={
                      newDelegateAddress === null
                        ? "No matching ENS address was found."
                        : newDelegateAddress === currentDelegateAddress
                          ? "Already set to the provided address."
                          : undefined
                    }
                    endContent={
                      <Spinner size="sm" style={{ opacity: delegateLoading ? "100" : "0" }} />
                    }
                  />
                  {newDelegateAddress && !delegateLoading && (
                    <div className="mt-2">
                      {delegateDataError ? (
                        <p className="text-sm text-danger-500">
                          There was an error fetching the votes for the provided delegate address.
                        </p>
                      ) : (
                        <Card className="bg-default-100">
                          <CardBody>
                            <div className="flex justify-between">
                              <div className="flex flex-col">
                                <h6 className="text-2xs text-foreground-500 xs:text-xs">
                                  Delegate:
                                </h6>
                                {newDelegateAddress === accountAddress ? (
                                  <span className="sm:text-md text-sm">Yourself</span>
                                ) : (
                                  <DisplayAddress
                                    address={newDelegateAddress}
                                    className="sm:text-md text-sm"
                                    knownEnsName={ensName}
                                    enableClickToCopy
                                  />
                                )}
                                {ensName && (
                                  <DisplayAddress
                                    address={newDelegateAddress}
                                    className="text-xs text-foreground-600 sm:text-sm"
                                    skipEns
                                    enableClickToCopy
                                  />
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <h6 className="text-2xs text-foreground-500 xs:text-xs">
                                  Current Votes:
                                </h6>
                                <span className="sm:text-md text-sm font-bold">
                                  {delegateVotesDisplay}
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
                    <Button className="mr-2" onPress={() => setIsUpdatingDelegate(false)}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      isDisabled={!newDelegateAddress}
                      isLoading={isWriteContractPending}
                      onPress={sendUpdateDelegateTx}
                    >
                      Update Delegate
                    </Button>
                  </div>
                </>
              ) : isCurrentDelegateAddressLoading ? (
                <div className="my-2 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : currentDelegateAddressError ? (
                <div className="my-2 flex items-center justify-center">
                  <p className="text-center text-danger-600">
                    There was an unexpected error loading your delegate info.
                  </p>
                </div>
              ) : (
                <>
                  {currentDelegateDisplay ? (
                    <>
                      <div className="mb-1 text-sm">
                        <i>Delegating {formattedMushiBalance} votes to:</i>
                      </div>
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
                        className="mt-4"
                        fullWidth
                        onPress={() => startUpdatingDelegate(true)}
                      >
                        Delegate to Yourself
                      </Button>
                    </>
                  )}
                  <Button
                    color="primary"
                    className="mt-4"
                    fullWidth
                    onPress={() => startUpdatingDelegate()}
                  >
                    Update Delegate
                  </Button>
                </>
              )
            ) : accountAddress ? (
              <>
                <p className="text-sm sm:text-base italic text-foreground-500 mb-2">
                  You currently have no votes to delegate.
                </p>
                <div className="mt-2 flex justify-end">
                  <Button onPress={close}>Close</Button>
                </div>
              </>
            ) : (
              <Button onPress={() => openConnectModal && openConnectModal()} color="primary">
                Connect Wallet
              </Button>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
