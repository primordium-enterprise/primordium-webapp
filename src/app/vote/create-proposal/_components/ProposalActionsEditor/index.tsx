"use client";

import { getEtherscanContract } from "@/fetch/etherscan";
import { GovernanceData } from "@/subgraph/subgraphQueries";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
} from "@nextui-org/react";
import Input from "@/components/Input";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  Abi,
  AbiFunction,
  AbiParameter,
  Address,
  ContractFunctionArgs,
  Hex,
  isAddress,
  toFunctionSignature,
} from "viem";

export interface ProposalAction {
  target: Address;
  value: BigInt;
  signature?: string;
  calldata: Hex;
  abi?: Abi;
  functionName?: string;
  args?: ContractFunctionArgs[];
}

type ActionType = "function" | "value";
const actionTypeDisplays: {
  [key in ActionType]: string;
} = {
  function: "Function Call",
  value: "Value Transfer",
} as const;
const actionTypes = Object.keys(actionTypeDisplays) as ActionType[];

interface AbiFunctionOption extends AbiFunction {
  signature: string;
}

export default function ProposalActionsEditor({
  governanceData,
  actions,
  setActions,
}: {
  governanceData: GovernanceData | undefined;
  actions: ProposalAction[];
  setActions: Dispatch<SetStateAction<ProposalAction[]>>;
}) {
  const [isCreateActionModalOpen, setIsCreateActionModalOpen] = useState(false);

  const [target, setTarget] = useState("");
  const isTargetValid = useMemo(() => isAddress(target), [target]);

  const [value, setValue] = useState("");

  const [signature, setSignature] = useState("");
  // const [selectedSignature, setSelectedSignature] = useState<Set<string>(new Set[]);

  const [args, setArgs] = useState<ContractFunctionArgs[]>([]);

  const [actionType, setActionType] = useState<ActionType>("function");

  const needsAbi = useMemo(() => actionType === "function", [actionType]);

  // Load the ABI from Etherscan
  const {
    data: etherscanAbi,
    isLoading: isEtherscanAbiLoading,
    isFetched: isEtherscanAbiFetched,
    isError: isEtherscanAbiError,
  } = useQuery({
    queryKey: ["etherscanAbi", target],
    queryFn: ({ queryKey }) =>
      getEtherscanContract(queryKey[1] as Address).then((contract) => contract.parsedAbi || null),
    enabled: isTargetValid && needsAbi,
    gcTime: 1200000, // 20 min
  });

  const [isUploadAbiSelected, setIsUploadAbiSelected] = useState(false);
  const requireUploadAbi = useMemo(
    () => isEtherscanAbiFetched && etherscanAbi === null,
    [etherscanAbi, isEtherscanAbiFetched],
  );

  const showUploadAbi = useMemo(
    () => isUploadAbiSelected || requireUploadAbi,
    [isUploadAbiSelected, requireUploadAbi],
  );

  const uploadAbiInputRef = useRef<HTMLInputElement>(null);
  const [uploadAbiInputKey, setUploadAbiInputKey] = useState(0);
  const resetUploadAbiFileInput = () => {
    if (uploadAbiInputRef.current) {
      uploadAbiInputRef.current;
    }
  };

  const [uploadAbiFile, setUploadAbiFile] = useState<File | null>(null);
  const { uploadAbi, isUploadAbiError } = useMemo(() => {
    console.log(uploadAbiFile);
    const result: { uploadAbi: Abi | null; isUploadAbiError: boolean } = {
      uploadAbi: null,
      isUploadAbiError: false,
    };
    if (uploadAbiFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            result.uploadAbi = parsed;
          } else {
            if (parsed.abi && Array.isArray(parsed.abi)) {
              result.uploadAbi = parsed.abi;
            }
            throw new Error("Invalid ABI format");
          }
        } catch (e) {
          console.error(e);
          result.isUploadAbiError = true;
        }
      };
      reader.readAsText(uploadAbiFile, "UTF-8");
    }
    return result;
  }, [uploadAbiFile]);

  const abi = useMemo(() => {
    return uploadAbi || etherscanAbi;
  }, [etherscanAbi, uploadAbi]);

  // The AbiFunction types filtered from the current active ABI, with an included "signature" property
  const functionOptions: AbiFunctionOption[] = useMemo(() => {
    if (!abi) {
      // Reset the selected signature
      setSignature("");
      return [];
    }
    const filtered = abi
      .filter(
        (item) =>
          item.type === "function" &&
          (item.stateMutability === "nonpayable" || item.stateMutability === "payable"),
      )
      .map((item) => ({
        ...item,
        signature: toFunctionSignature(item as AbiFunction),
      })) as AbiFunctionOption[];
    setSignature(filtered[0]?.signature || "");
    return filtered;
  }, [abi]);

  useEffect(() => console.log(functionOptions), [functionOptions]);
  useEffect(() => console.log(signature), [signature]);

  return (
    <div>
      <div className="my-2">
        {actions.length > 0 ? (
          <>
            {actions.map((action, index) => (
              <div key={index}>
                <div>{action.target}</div>
                <div>{action.value.toString()}</div>
                <div>{action.signature}</div>
                <div>{action.functionName}</div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-foreground-500">No actions created yet.</div>
        )}
      </div>
      <Button
        className="mt-4"
        color="primary"
        fullWidth
        onPress={() => setIsCreateActionModalOpen(true)}
      >
        Add Proposal Action
      </Button>
      <Modal
        isOpen={isCreateActionModalOpen}
        onOpenChange={setIsCreateActionModalOpen}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="font-londrina-solid text-xl sm:text-2xl">
            Create Proposal Action
          </ModalHeader>
          <ModalBody className="px-3 py-2 text-2xs xs:px-6 xs:py-3 sm:text-xs">
            <Select
              label="Action type:"
              selectedKeys={[actionType]}
              onChange={(e) => setActionType(e.target.value as ActionType)}
            >
              {actionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {actionTypeDisplays[type]}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Target address:"
              variant="bordered"
              placeholder="0x..."
              value={target}
              // size="md"
              onValueChange={setTarget}
              isInvalid={target.length > 0 && !isTargetValid}
              classNames={
                {
                  // description: "text-2xs xs:text-xs"
                }
              }
              description={
                actionType === "function"
                  ? "Enter the target address of the contract to interact with. The ABI will be fetched from Etherscan (if verified)."
                  : "Enter the address to send ETH to."
              }
              isRequired
            />

            {actionType === "function" && (
              <>
                <div className="flex justify-center">
                  {isEtherscanAbiLoading ? (
                    <Spinner size="sm" />
                  ) : isEtherscanAbiError ? (
                    <span className="text-warning-400">Error fetching ABI from Etherscan.</span>
                  ) : (
                    isEtherscanAbiFetched &&
                    (etherscanAbi ? (
                      <span className="text-success-400">
                        ABI successfully fetched from Etherscan.
                      </span>
                    ) : (
                      <span className="text-foreground-500">No ABI found on Etherscan.</span>
                    ))
                  )}
                </div>

                <Switch
                  size="sm"
                  isSelected={showUploadAbi}
                  onValueChange={setIsUploadAbiSelected}
                  classNames={{
                    base: "text-foreground-500 data-[selected=true]:text-foreground",
                    label: "text-tiny xs:text-small text-inherit",
                  }}
                >
                  Upload custom ABI
                </Switch>

                {showUploadAbi && (
                  <>
                    <input
                      type="file"
                      ref={uploadAbiInputRef}
                      key={uploadAbiInputKey}
                      onChange={(e) => {
                        console.log(e.target.files);
                        const { files } = e.target;
                        setUploadAbiFile(files && (files[0] || null));
                      }}
                      hidden
                    />
                    <Button variant="bordered" onPress={() => uploadAbiInputRef.current?.click()}>
                      Choose ABI File
                    </Button>
                    {uploadAbiFile && (
                      <div className="flex items-center justify-end gap-1 xs:gap-2">
                        <span>{uploadAbiFile.name}</span>
                        <Button
                          size="sm"
                          className="min-h-0 min-w-0 px-2 py-1 text-2xs xs:px-3 xs:py-2 xs:text-xs"
                          onPress={() => {
                            setUploadAbiFile(null);
                            setUploadAbiInputKey((key) => key + 1);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                    {isUploadAbiError && (
                      <span className="text-warning-400">Error parsing ABI from file.</span>
                    )}
                  </>
                )}

                {functionOptions.length > 0 && (
                  <Select
                    label="Function to call:"
                    items={functionOptions}
                    selectedKeys={[signature]}
                    onChange={(e) => setSignature(e.target.value)}
                    variant="bordered"
                    selectionMode="single"
                    isDisabled={functionOptions.length === 0}
                    classNames={{
                      value: "text-tiny xs:text-small",
                      label: "text-2xs xs:text-xs",
                    }}
                    scrollShadowProps={{
                      isEnabled: false,
                    }}
                  >
                    {(functionOption) => (
                      <SelectItem key={functionOption.signature} value={functionOption.signature}>
                        {functionOption.signature}
                      </SelectItem>
                    )}
                  </Select>
                )}
              </>
            )}

            {/* <Input
              label="Value (ETH):"
              variant="bordered"
              type="number"
              placeholder="0"
              value={value}
              onValueChange={setValue}
            /> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
