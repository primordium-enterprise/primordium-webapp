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
import { Dispatch, SetStateAction, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Abi,
  AbiFunction,
  AbiParameter,
  Address,
  ContractFunctionArgs,
  Hex,
  encodeAbiParameters,
  isAddress,
  toFunctionSignature,
} from "viem";
import { AbiFunctionOption, ProposalAction, ProposalActionType } from "./types";
import FunctionOptionInputParams from "./components/FunctionOptionInputParams";
import { getArrayComponents } from "@/utils/abi";

const actionTypeDisplays: {
  [key in ProposalActionType]: string;
} = {
  function: "Function Call",
  value: "Value Transfer",
} as const;
const actionTypes = Object.keys(actionTypeDisplays) as ProposalActionType[];

interface UploadAbiState {
  file: File | null;
  isAbiError: boolean;
  abi: Abi | null;
}

const defaultUploadAbiState: UploadAbiState = {
  file: null,
  isAbiError: false,
  abi: null,
};

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

  // Type of action to take (function call or value transfer)
  const [actionType, setActionType] = useState<ProposalActionType>("function");

  // Action target input
  const [target, setTarget] = useState("");
  const isTargetValid = useMemo(() => isAddress(target), [target]);

  // Action ETH value input
  const [value, setValue] = useState("");

  const [args, setArgs] = useState<ContractFunctionArgs[]>([]);
  // Needs an ABI if the action type is a function call
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

  // Allow user to upload a custom ABI
  const [isUploadAbiSelected, setIsUploadAbiSelected] = useState(false);

  // Upload is required if no etherscan ABI found
  const requireUploadAbi = useMemo(
    () => isEtherscanAbiError || (isEtherscanAbiFetched && etherscanAbi === null),
    [etherscanAbi, isEtherscanAbiFetched, isEtherscanAbiError],
  );
  const showUploadAbi = useMemo(
    () => isUploadAbiSelected || requireUploadAbi,
    [isUploadAbiSelected, requireUploadAbi],
  );

  // Handle file upload, and parsed ABI
  const uploadAbiInputRef = useRef<HTMLInputElement>(null);
  const [uploadAbiInputKey, setUploadAbiInputKey] = useState(0); // Used to reset input element
  const [uploadAbiState, uploadAbiDispatch] = useReducer(
    (state: UploadAbiState, update: Partial<UploadAbiState>) => {
      let newState = { ...state, ...update };
      if (update.abi) {
        newState.isAbiError = false;
      } else if (update.isAbiError) {
        newState.abi = null;
      }
      return newState;
    },
    defaultUploadAbiState,
  );
  const { file: uploadAbiFile, abi: uploadAbi, isAbiError: isUploadAbiError } = uploadAbiState;
  useEffect(() => {
    if (uploadAbiFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            uploadAbiDispatch({ abi: parsed });
          } else {
            if (parsed.abi && Array.isArray(parsed.abi)) {
              uploadAbiDispatch({ abi: parsed.abi });
            }
            throw new Error("Invalid ABI format");
          }
        } catch (e) {
          console.error(e);
          uploadAbiDispatch({ isAbiError: true });
        }
      };
      reader.readAsText(uploadAbiFile, "UTF-8");
    }
  }, [uploadAbiFile]);

  // Valid if the uploaded ABI is present and not errored
  const isUploadAbiValid = useMemo(
    () => uploadAbi && !isUploadAbiError,
    [uploadAbi, isUploadAbiError],
  );

  // The parsed ABI (prioritizing the uploaded ABI over the Etherscan ABI)
  const abi = useMemo(() => {
    return isUploadAbiSelected ? (isUploadAbiValid ? uploadAbi : null) : etherscanAbi;
  }, [isUploadAbiSelected, isUploadAbiValid, uploadAbi, etherscanAbi]);

  // The selected function option from the ABI
  const [functionOption, setFunctionOption] = useState<AbiFunctionOption | null>(null);

  // The AbiFunction types filtered from the current active ABI, with an included "signature" property
  const functionOptions: AbiFunctionOption[] = useMemo(() => {
    // Return empty array (resetting function option to null too) when no ABI is needed or present
    if (!needsAbi || !abi) {
      // Reset the selected function option
      setFunctionOption(null);
      return [];
    }
    const filtered = (
      abi.filter(
        (item) =>
          item.type === "function" &&
          (item.stateMutability === "nonpayable" || item.stateMutability === "payable"),
      ) as AbiFunction[]
    ).map((item) => {
      return {
        ...item,
        signature: toFunctionSignature(item as AbiFunction),
        arrayComponentsByInputIndex: (item as AbiFunction).inputs.reduce(
          (acc, param, index) => {
            acc[index] = getArrayComponents(param.type);
            return acc;
          },
          {} as { [index: number]: ReturnType<typeof getArrayComponents> },
        ),
      };
    });
    setFunctionOption(filtered[0] || null);
    return filtered;
  }, [needsAbi, abi]);

  useEffect(() => console.log(functionOptions), [functionOptions]);

  // Value is disabled (and set to 0) if the selected function is nonpayable
  const isValueDisabled = useMemo(() => {
    console.log(functionOption);
    if (functionOption?.stateMutability === "nonpayable") {
      setValue("0");
      return true;
    }
    return false;
  }, [functionOption]);

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
              onChange={(e) => setActionType(e.target.value as ProposalActionType)}
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
                      <span className="text-success-300">
                        ABI sucessfully downloaded from Etherscan.
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
                        uploadAbiDispatch({
                          ...defaultUploadAbiState,
                          file: files && (files[0] || null),
                        });
                      }}
                      hidden
                    />
                    <p>
                      Upload a JSON ABI file of your own.
                      {etherscanAbi && (
                        <span className="text-warning-500">
                          {" "}
                          The uploaded ABI will be used in place of the ABI downloaded from
                          Etherscan. Only proceed if you are sure the ABI is correct.
                        </span>
                      )}
                    </p>
                    <Button
                      color={isUploadAbiError ? "warning" : "primary"}
                      variant="flat"
                      onPress={() => uploadAbiInputRef.current?.click()}
                    >
                      Choose ABI File
                    </Button>
                    {uploadAbiFile && (
                      <div>
                        <div className="flex items-center justify-end gap-1 xs:gap-2">
                          <span className={`text-${isUploadAbiError ? "warning" : "success"}-300`}>
                            {uploadAbiFile.name}
                          </span>
                          <Button
                            size="sm"
                            className="min-h-0 min-w-0 px-2 py-1 text-2xs xs:px-3 xs:py-2 xs:text-xs"
                            onPress={() => {
                              uploadAbiDispatch({ file: null, isAbiError: false, abi: null });
                              setUploadAbiInputKey((key) => key + 1);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                        {isUploadAbiError && (
                          <div className="mt-1 text-danger-300">
                            There was an error parsing the ABI from the provided file. Please ensure
                            that the file is a properly formatted JSON ABI.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {functionOptions.length > 0 && (
                  <Select
                    label="Function to call:"
                    items={functionOptions}
                    selectedKeys={[functionOption?.signature || ""]}
                    onChange={(e) => {
                      setFunctionOption(
                        functionOptions.find((f) => f.signature === e.target.value) || null,
                      );
                    }}
                    disallowEmptySelection
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

            {(!needsAbi || !!functionOption) && (
              <>
                <Input
                  label="Value (ETH):"
                  variant="bordered"
                  type="number"
                  placeholder="0"
                  value={value}
                  isDisabled={isValueDisabled}
                  description={isValueDisabled ? "This function is nonpayable." : ""}
                  onValueChange={setValue}
                />
              </>
            )}

            {functionOption && (
              <>
                <p className="text-sm xs:text-md font-bold">Input function parameters:</p>
                <FunctionOptionInputParams functionOption={functionOption} />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
