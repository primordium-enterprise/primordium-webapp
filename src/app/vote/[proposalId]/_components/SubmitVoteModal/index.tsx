"use client";

import PrimordiumGovernorV1Abi from "@/abi/PrimordiumGovernorV1.abi";
import PrimordiumTokenV1Abi from "@/abi/PrimordiumTokenV1.abi";
import ButtonExtended from "@/components/_nextui/ButtonExtended";
import InputExtended from "@/components/_nextui/InputExtended";
import { chainConfig } from "@/config/chainConfig";
import { defaultChain } from "@/config/wagmi-config";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import { ProposalData } from "@/subgraph/subgraphQueries";
import abbreviateBalance from "@/utils/abbreviateBalance";
import handleViemContractError from "@/utils/handleViemContractError";
import { ProposalVoteType } from "@/utils/proposalUtils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address } from "viem";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";

interface Props extends Omit<ModalProps, "children"> {
  proposal: ProposalData;
}

const voteOptions = [
  {
    label: "For",
    value: ProposalVoteType.For.toString(),
    className: "!text-success-300",
  },
  {
    label: "Against",
    value: ProposalVoteType.Against.toString(),
    className: "!text-danger-300",
  },
  {
    label: "Abstain",
    value: ProposalVoteType.Abstain.toString(),
    className: "!text-default-500",
  },
];

const governorContract = {
  abi: PrimordiumGovernorV1Abi,
  address: chainConfig[defaultChain.id]?.addresses.governor,
} as const;

export default function SubmitVoteModal({ proposal, ...modalProps }: Props) {
  const { address } = useAccount();
  const { open: openWeb3Modal } = useWeb3Modal();

  const {
    data: [{ result: hasVoted = undefined }, { result: voteAmount = undefined }] = [{}, {}],
    isLoading: isVoteStatusLoading,
    isError: isVoteStatusError,
    refetch: refetchVoteStatus,
  } = useReadContracts({
    contracts: [
      {
        abi: PrimordiumGovernorV1Abi,
        address: chainConfig[defaultChain.id]?.addresses.governor,
        functionName: "hasVoted",
        args: [BigInt(proposal.id), address as Address],
      },
      {
        abi: PrimordiumTokenV1Abi,
        address: chainConfig[defaultChain.id]?.addresses.token,
        functionName: "getPastVotes",
        args: [address as Address, BigInt(proposal.voteStart)],
      },
    ],
    query: {
      enabled: !!address && modalProps.isOpen,
    },
  });

  const voteAmountDisplay = useMemo(
    () => (voteAmount !== undefined ? abbreviateBalance(voteAmount) : undefined),
    [voteAmount],
  );

  const [support, setSupport] = useState(voteOptions[0].value);
  const [reason, setReason] = useState("");

  const isValid = useMemo(() => {
    return Number(support) in ProposalVoteType && !hasVoted;
  }, [support, hasVoted]);

  const { addTransaction } = useContext(LocalTransactionsContext);
  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const submitVoteTx = () => {
    const supportNumber = Number(support);
    const description = `Cast vote (${voteOptions.find((o) => o.value === support)?.label.toLocaleUpperCase()}) on proposal ${BigInt(proposal.id).toString()}`;
    const useReason = reason.length > 0;

    const toastId = toast.loading("Casting your vote...");
    writeContractAsync({
      abi: PrimordiumGovernorV1Abi,
      address: chainConfig[defaultChain.id]?.addresses.governor,
      functionName: useReason ? "castVoteWithReason" : "castVote",
      args: useReason
        ? [BigInt(proposal.id), supportNumber, reason]
        : [BigInt(proposal.id), supportNumber],
    })
      .then((hash) => {
        addTransaction(hash, description, toastId, () => {
          refetchVoteStatus();
        });
        modalProps.onOpenChange && modalProps.onOpenChange(false);
      })
      .catch((error) => handleViemContractError(error, toastId));
  };

  return (
    <Modal {...modalProps}>
      <ModalContent>
        <ModalHeader className="font-londrina-solid text-xl sm:text-2xl">
          Vote on Proposal
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Select
            selectedKeys={[support]}
            onChange={(e) => setSupport(e.target.value)}
            label="Support:"
            disallowEmptySelection
            classNames={{
              value:
                support === "1"
                  ? "!text-success-400"
                  : support === "0"
                    ? "!text-danger-400"
                    : "!text-default-500",
            }}
          >
            {voteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className={option.className}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <InputExtended value={reason} onValueChange={setReason} label="Reason (optional):" />
          <div className="flex flex-wrap justify-between gap-1 text-xs sm:text-sm">
            <div className="text-foreground-500">Your votes:</div>
            <div className="">{isVoteStatusLoading ? "..." : voteAmountDisplay || "0"} MUSHI</div>
          </div>
          {hasVoted && (
            <div className="mt-2 text-end text-xs text-warning-500 sm:text-sm">
              You have already voted on this proposal.
            </div>
          )}
          {address && isVoteStatusError && (
            <div className="mt-2 text-end text-xs text-danger-500 sm:text-sm">
              There was an error fetching your vote status.
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <ButtonExtended onPress={() => modalProps.onOpenChange && modalProps.onOpenChange(false)}>
            Cancel
          </ButtonExtended>
          {!address ? (
            <ButtonExtended color="primary" onPress={() => openWeb3Modal()}>
              ConnectWallet
            </ButtonExtended>
          ) : (
            <ButtonExtended
              color="primary"
              isLoading={isVoteStatusLoading || isWriteContractPending}
              isDisabled={!isValid}
              onPress={submitVoteTx}
            >
              Submit Vote
            </ButtonExtended>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
