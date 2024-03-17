"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem,
  Spinner,
  Switch,
} from "@nextui-org/react";
import {
  AbiFunctionInputParam,
  AbiFunctionOption,
  ProposalAction,
  ProposalActionType,
  actionTypeDisplays,
} from "../../types";
import FunctionInputParams from "../FunctionInputParams";
import InputExtended from "@/components/_nextui/InputExtended";
import {
  Abi,
  AbiFunction,
  Address,
  Hex,
  decodeFunctionData,
  encodeFunctionData,
  isAddress,
  parseEther,
  toFunctionSignature,
} from "viem";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEtherscanContract } from "@/fetch/etherscan";
import { getArrayComponents } from "@/utils/abi";
import { UnionPartialBy } from "node_modules/viem/_types/types/utils";
import toast from "react-hot-toast";

const actionTypes: ProposalActionType[] = ["value", "function"];

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

interface Props extends Omit<ModalProps, "children"> {
  addProposalAction: (action: ProposalAction) => void;
}

export default function CreateProposalActionModal({ addProposalAction, ...modalProps }: Props) {
  // Type of action to take (function call or value transfer)
  const [actionType, setActionType] = useState<ProposalActionType>("value");

  // Action target input
  const [target, setTarget] = useState("");
  const isTargetValid = useMemo(() => isAddress(target), [target]);

  // Action ETH value input
  const [value, setValue] = useState("");

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
    // If uploadAbi is selected or required, return only the uploaded abi (or null). Otherwise, return the Etherscan ABI
    return isUploadAbiSelected || requireUploadAbi
      ? isUploadAbiValid
        ? uploadAbi
        : null
      : etherscanAbi;
  }, [isUploadAbiSelected, requireUploadAbi, isUploadAbiValid, uploadAbi, etherscanAbi]);

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

  // Value is disabled (and set to 0) if the selected function is nonpayable
  const isValueDisabled = useMemo(() => {
    if (functionOption?.stateMutability === "nonpayable") {
      setValue("0");
      return true;
    }
    return false;
  }, [functionOption]);

  const [inputParams, setInputParams] = useState<AbiFunctionInputParam[]>([]);
  const isInputParamsValid = useMemo(() => {
    return inputParams.every((inputParam) => {
      return inputParam.valueItems.every((item) => !item.isInvalid);
    });
  }, [inputParams]);

  const isActionValid = useMemo(() => {
    if (actionType === "function") {
      return isTargetValid && isInputParamsValid;
    } else {
      return isTargetValid && value && parseEther(value) > BigInt(0);
    }
  }, [isTargetValid, value, isInputParamsValid, actionType]);

  const createProposalAction = () => {
    const action: ProposalAction = {
      actionType,
      target: target as Address,
      value: parseEther(value || "0"),
      signature: "",
      calldata: "0x",
    };

    if (actionType === "function") {
      if (!functionOption) {
        return toast.error("No function option is selected.");
      }
      action.signature = functionOption.signature;
      try {
        action.abi = [functionOption];
        // No functionName needed for abi with one argument
        action.calldata = encodeFunctionData({
          abi: action.abi,
          args: inputParams.map((inputParam) => {
            if (inputParam.arrayComponents) {
              return inputParam.valueItems.map((valueItem) => valueItem.parsedValue);
            }
            return inputParam.valueItems[0].parsedValue;
          }),
        });
        action.abiFunctionInputParams = inputParams;
      } catch (e) {
        console.log(e);
        return toast.error("Failed to encode the function calldata.");
      }
    }

    if (!isActionValid) {
      return toast.error("The action is not formatted correctly.");
    }

    addProposalAction(action);

    // Reset the state
    setTarget("");
    setValue("");
    setIsUploadAbiSelected(false);
  };

  return (
    <Modal {...modalProps}>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader className="font-londrina-solid text-xl sm:text-2xl">
          Create Proposal Action
        </ModalHeader>
        <ModalBody className="overflow-y-auto px-3 py-2 text-2xs xs:px-6 xs:py-3 sm:text-xs">
          <Select
            label="Action type:"
            selectedKeys={[actionType]}
            onChange={(e) => setActionType(e.target.value as ProposalActionType)}
            disallowEmptySelection
          >
            {actionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {actionTypeDisplays[type]}
              </SelectItem>
            ))}
          </Select>

          <InputExtended
            label="Target address:"
            variant="bordered"
            placeholder="0x..."
            value={target}
            // size="md"
            onValueChange={setTarget}
            isInvalid={target.length > 0 && !isTargetValid}
            description={
              actionType === "function" ? (
                <span>
                  Enter the target address of the contract to interact with.{" "}
                  {isEtherscanAbiFetched &&
                    (etherscanAbi ? (
                      <span className="text-success-300">
                        ABI sucessfully downloaded from Etherscan.
                      </span>
                    ) : (
                      <span className="text-warning-300">
                        {isEtherscanAbiError
                          ? "The ABI failed to download from Etherscan."
                          : "No ABI found on Etherscan."}{" "}
                        You must upload your own ABI file to continue.
                      </span>
                    ))}
                </span>
              ) : (
                "Enter the address to send ETH to."
              )
            }
          />

          {actionType === "function" && (
            <>
              {isEtherscanAbiLoading && (
                <div className="flex justify-center text-center">
                  <Spinner size="sm" />
                </div>
              )}

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
                        The uploaded ABI will be used in place of the ABI downloaded from Etherscan.
                        Only proceed if you are sure the ABI is correct.
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
              <InputExtended
                label="Value (ETH):"
                variant="bordered"
                type="number"
                min="0"
                placeholder="0"
                value={value}
                isDisabled={isValueDisabled}
                description={
                  !needsAbi
                    ? "Enter the proposed ETH value to transfer from the treasury."
                    : isValueDisabled
                      ? "This function is nonpayable."
                      : "The proposed ETH value to send with this function call."
                }
                onValueChange={(v) => {
                  let decimal = v.indexOf(".");
                  if (decimal > -1 && v.length - 1 - decimal > 18) {
                    return;
                  }
                  setValue(v);
                }}
              />
            </>
          )}

          {functionOption && (
            <>
              <p className="xs:text-md text-sm font-bold">Input function parameters:</p>
              <FunctionInputParams
                functionOption={functionOption}
                inputParams={inputParams}
                setInputParams={setInputParams}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button
            onPress={() => modalProps.onOpenChange && modalProps.onOpenChange(false)}
            variant="flat"
          >
            Cancel
          </Button>
          <Button color="primary" isDisabled={!isActionValid} onPress={createProposalAction}>
            Create Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
