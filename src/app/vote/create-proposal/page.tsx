"use client";

import PrimordiumGovernorV1Abi from "@/abi/PrimordiumGovernorV1.abi";
import WarningCard from "@/components/WarningCard";
import { chainConfig } from "@/config/chainConfig";
import { defaultChain } from "@/config/wagmi-config";
import { DelegateQuery, GovernanceDataQuery } from "@/subgraph/subgraphQueries";
import abbreviateBalance from "@/utils/abbreviateBalance";
import { Link, Spinner } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "urql";
import { Address, Hex, encodeFunctionData } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import ProposalActionsEditor from "./_components/ProposalActionsEditor";
import buildEtherscanURL from "@/utils/buildEtherscanURL";
import {
  PROPOSAL_ACTIONS_STORAGE_KEY,
  ProposalAction,
} from "./_components/ProposalActionsEditor/types";
import { fromJSON } from "@/utils/JSONBigInt";
import InputExtended from "@/components/_nextui/InputExtended";
import TextareaExtended from "@/components/_nextui/TextareaExtended";
import ButtonExtended from "@/components/_nextui/ButtonExtended";
import toast from "react-hot-toast";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import handleViemContractError from "@/utils/handleViemContractError";
import BackButton from "@/components/BackButton";

const MAX_BPS = 10000;

export default function CreateProposalPage() {
  const { address } = useAccount();

  const [delegateResult] = useQuery({
    query: DelegateQuery,
    variables: { address: address as Address },
    pause: !address,
  });
  const {
    data: { delegate } = {},
    fetching: delegateFetching,
    error: delegateError,
  } = delegateResult;

  const [governanceDataResult] = useQuery({ query: GovernanceDataQuery });
  const {
    data: { governanceData, _meta } = {},
    fetching: governanceDataFetching,
    error: governanceDataError,
  } = governanceDataResult;

  useEffect(() => {
    if (governanceDataError) {
      console.error(governanceDataError);
    }
  }, [governanceDataError]);

  const { proposalThreshold, proposalThresholdPercentageDisplay, proposalThresholdDisplay } =
    useMemo(() => {
      let proposalThresholdBps;
      let proposalThresholdPercentageDisplay: JSX.Element | string = (
        <Link
          href={buildEtherscanURL(
            `address/${chainConfig[defaultChain.id].addresses.governor}#readProxyContract`,
          )}
          isExternal
        >
          proposalThresholdBps()
        </Link>
      );
      let proposalThresholdDisplay;
      let proposalThreshold: bigint | undefined;
      if (governanceData) {
        proposalThresholdBps = Number(governanceData.proposalThresholdBps);
        proposalThresholdPercentageDisplay = `${proposalThresholdBps / 100}%`;
        proposalThreshold =
          (BigInt(governanceData.totalSupply) * BigInt(proposalThresholdBps)) / BigInt(MAX_BPS);
        proposalThresholdDisplay = abbreviateBalance(proposalThreshold);
      }
      return {
        proposalThresholdBps,
        proposalThresholdPercentageDisplay,
        proposalThresholdDisplay,
        proposalThreshold,
      };
    }, [governanceData]);

  const { governanceThresholdBps, maxSupply, totalSupply } = useMemo(() => {
    return {
      governanceThresholdBps: governanceData?.governanceThresholdBps,
      maxSupply: governanceData?.maxSupply,
      totalSupply: BigInt(governanceData?.totalSupply || 0),
    };
  }, [governanceData]);

  const governanceThreshold = useMemo(() => {
    if (!governanceThresholdBps || !maxSupply) return undefined;
    return ((BigInt(maxSupply) * BigInt(governanceThresholdBps)) / BigInt(MAX_BPS)
    );
  }, [governanceThresholdBps, maxSupply]);

  // Track the proposal actions in state
  const [actions, setActions] = useState<ProposalAction[]>([]);

  // On page load, get actions from session storage
  useEffect(() => {
    const savedActions = window.sessionStorage.getItem(PROPOSAL_ACTIONS_STORAGE_KEY);
    if (savedActions) {
      setActions(fromJSON(savedActions));
    }
  }, []);

  // Proposal title (cached to session storage)
  const [title, setTitle] = useState("");
  useEffect(() => {
    setTitle(window.sessionStorage.getItem("APP_create-proposal-title") || "");
  }, []);

  const titleUpdateTimeoutRef = useRef<number | undefined>(undefined);
  const updateTitle = (newTitle: string) => {
    window.clearTimeout(titleUpdateTimeoutRef.current);
    titleUpdateTimeoutRef.current = window.setTimeout(() => {
      window.sessionStorage.setItem("APP_create-proposal-title", newTitle);
      titleUpdateTimeoutRef.current = undefined;
    }, 500);
    setTitle(newTitle);
  };

  // Proposal description (cached to session storage)
  const [description, setDescription] = useState("");
  useEffect(() => {
    setDescription(window.sessionStorage.getItem("APP_create-proposal-description") || "");
  }, []);

  const descriptionUpdateTimeoutRef = useRef<number | undefined>(undefined);
  const updateDescription = (newDescription: string) => {
    window.clearTimeout(descriptionUpdateTimeoutRef.current);
    descriptionUpdateTimeoutRef.current = window.setTimeout(() => {
      window.sessionStorage.setItem("APP_create-proposal-description", newDescription);
      descriptionUpdateTimeoutRef.current = undefined;
    }, 500);
    setDescription(newDescription);
  };

  // Check if the proposal is valid
  const isProposalValid = useMemo(() => {
    return actions.length > 0 && title && description;
  }, [actions, title, description]);

  // Write the transaction to create the proposal
  const { addTransaction } = useContext(LocalTransactionsContext);
  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const getFormattedDescription = () => {
    return `# ${title}\n\n${description}`;
  };

  const getSplitActions = (): [Address[], bigint[], Hex[], string[]] => {
    return actions.reduce(
      ([t, v, c, s], action) => {
        t.push(action.target);
        v.push(action.value);
        c.push(action.calldata);
        s.push(action.signature);
        return [t, v, c, s];
      },
      [[], [], [], []] as [Address[], bigint[], Hex[], string[]],
    );
  };

  const createProposalTx = () => {
    if (!isProposalValid) {
      toast.error("Proposal is not valid for submission.");
    }
    const toastId = toast.loading("Submitting transaction to create proposal...");
    const txDescription = `Create proposal: ${title}`;
    writeContractAsync({
      abi: PrimordiumGovernorV1Abi,
      address: chainConfig[defaultChain.id]?.addresses.governor,
      functionName: "propose",
      args: [...getSplitActions(), getFormattedDescription()],
    })
      .then((hash) => {
        addTransaction(hash, txDescription, toastId);
        updateTitle('');
        updateDescription('');
        setActions([]);
        window.sessionStorage.removeItem(PROPOSAL_ACTIONS_STORAGE_KEY);
      })
      .catch((error) => handleViemContractError(error, toastId));
  };

  const copyProposalCalldata = () => {
    navigator.clipboard.writeText(
      encodeFunctionData({
        abi: PrimordiumGovernorV1Abi,
        functionName: "propose",
        args: [...getSplitActions(), getFormattedDescription()],
      }),
    );
    toast.success("Proposal calldata copied to clipboard!", { duration: 5000 });
  };

  return (
    <div
      data-section="create-proposal"
      className="pb-8 text-xs xs:text-sm sm:p-4 sm:pb-12 sm:text-base"
    >
      <div className="mb-4">
        <BackButton href="/vote" />
      </div>
      <h1 className="mb-2 font-londrina-shadow text-4xl xs:text-5xl sm:mb-4 sm:text-6xl">
        Create Proposal
      </h1>
      <div>
        {governanceDataFetching ? (
          <div className="my-12 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : governanceDataError ? (
          <p className="text-warning-400">
            There was an error when attempting to load the proposal submission settings.
          </p>
        ) : (
          <>
            <p>
              Unless you have the "proposer" role, you must have at least{" "}
              <b>{proposalThresholdPercentageDisplay}</b> of the total supply of MUSHI tokens
              delegated to your address to submit a proposal
              {proposalThresholdDisplay
                ? ` (which is currently about ${proposalThresholdDisplay} votes)`
                : ""}
              .
            </p>
            {BigInt((delegate && delegate.delegatedVotesBalance) || 0) <
              (proposalThreshold as bigint) && (
              <WarningCard className="mt-2 sm:mt-3">
                <p>
                  You do not have enough delegated votes to submit a proposal. You must have at
                  least {proposalThresholdDisplay} votes to submit a proposal.
                </p>
              </WarningCard>
            )}
            {governanceData && !governanceData.isFounded && (
              <WarningCard className="mt-2 sm:mt-3" color="primary">
                <p>
                  The governance contract has not been founded yet. The foundGovernor(uint256)
                  function on the Primordium Governor contract is the only allowable proposal action
                  until a founding proposal has been passed and executed.
                </p>
              </WarningCard>
            )}
            {governanceData &&
              _meta &&
              BigInt(_meta.block.timestamp) < BigInt(governanceData.governanceCanBeginAt) && (
                <WarningCard className="mt-2 sm:mt-3">
                  <p>
                    The governance contract cannot be founded until{" "}
                    <Link
                      href={`https://timestamp.online/countdown/${governanceData.governanceCanBeginAt}`}
                      isExternal
                    >
                      {governanceData.governanceCanBeginAt}
                    </Link>{" "}
                    UTC.
                  </p>
                </WarningCard>
              )}
            {governanceThreshold !== undefined && totalSupply < governanceThreshold && (
              <WarningCard className="mt-2 sm:mt-3">
                <p>
                  The goverance contract cannot be founded until at least{" "}
                  {abbreviateBalance(governanceThreshold || BigInt(0))} MUSHI tokens are in
                  circulation. Currently, the total MUSHI supply is at{" "}
                  {abbreviateBalance(totalSupply)} tokens.
                </p>
              </WarningCard>
            )}
          </>
        )}
      </div>
      <h3 className="mt-4 font-londrina-shadow text-2xl sm:mt-6 sm:text-3xl">On-Chain Actions</h3>
      <div className="mt-4 sm:mt-6">
        <ProposalActionsEditor
          governanceData={governanceData}
          actions={actions}
          setActions={setActions}
        />
      </div>
      <h3 className="mt-4 font-londrina-shadow text-2xl sm:mt-6 sm:text-3xl">Description</h3>
      <div className="mt-4 flex flex-col gap-4">
        <InputExtended
          label="Title:"
          placeholder="Enter a title for your proposal..."
          size="lg"
          value={title}
          onValueChange={updateTitle}
        />
        <TextareaExtended
          placeholder={
            "## Summary\n\nInsert your summary here\n\n## Methodology\n\nInsert your methodology here\n\n## Conclusion\n\nInsert your conclusion here"
          }
          disableAutosize
          disableAnimation
          classNames={{ input: "resize-y min-h-[15rem]" }}
          minRows={15}
          value={description}
          onValueChange={updateDescription}
          description={
            <div>
              <span>Proposal description's are formatted using </span>
              <Link
                style={{ fontSize: "inherit", lineHeight: "inherit" }}
                href="https://www.markdownguide.org/getting-started/"
                isExternal
              >
                markdown
              </Link>
              <span>
                . It is recommended to use only heading 2 (##) and 3 (###) in the description, as
                heading 1 (#) is used in the title.
              </span>
            </div>
          }
        />
      </div>
      <ButtonExtended
        color="primary"
        className="mt-4 sm:mt-6"
        size="lg"
        fullWidth
        isDisabled={!isProposalValid}
        onPress={createProposalTx}
      >
        Submit Proposal
      </ButtonExtended>
      <ButtonExtended
        className="mt-4 sm:mt-6"
        size="lg"
        fullWidth
        isDisabled={!isProposalValid}
        onPress={copyProposalCalldata}
      >
        Copy Transaction Calldata
      </ButtonExtended>
      <div className="text-foreground-500 text-2xs xs:text-xs mt-1">Copy the calldata to use in a different transaction builder.</div>
    </div>
  );
}
