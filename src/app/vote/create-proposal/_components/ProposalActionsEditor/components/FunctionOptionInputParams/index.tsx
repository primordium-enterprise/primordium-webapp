"use client";

import Input from "@/components/Input";
import { AbiFunctionOption } from "../../types";
import { Dispatch, SetStateAction, useEffect, useMemo, useReducer, useState } from "react";
import { AbiParameter, BaseError, encodeAbiParameters, isHex } from "viem";
import { Textarea as BaseTextArea, Button, extendVariants } from "@nextui-org/react";
import { getArrayComponents } from "@/utils/abi";

const Textarea = extendVariants(BaseTextArea, {
  defaultVariants: {
    maxRows: 3,
    minRows: 3,
  },
});

interface AbiFunctionInputParams {
  [inputIndex: number]: {
    values: string[];
    isInvalid?: boolean;
    errorMessage?: string;
  };
}

type AbiFunctionInputParam = {
  valueItems: AbiFunctionInputParamValueItem[];
  arrayComponents: ReturnType<typeof getArrayComponents>;
} & AbiParameter;

interface AbiFunctionInputParamValueItem {
  value: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

type ParsedAbiInputValue = string | boolean | bigint;
const parseAbiInputValue = (value: string, abiSingularType: string): ParsedAbiInputValue => {
  value = value.trim();

  console.log(value, isHex(value, { strict: true }))

  // String type, return as is
  if (abiSingularType === "string") {
    return value;
  }

  // Bool should be written as "true" or "false"
  if (abiSingularType === "bool") {
    if (value === "true" || value === "false") {
      return value === "true" ? true : false;
    } else {
      throw new Error("bool values must be 'true' or 'false'.");
    }
  }

  // If the input matches a numeric (no decimals), return a BigInt
  let numericMatch = /^(-?\d+)$/.exec(value);
  if (numericMatch) {
    return BigInt(numericMatch[1]);
  }

  // For bytes types, validate the hex string
  if (abiSingularType.startsWith("bytes")) {
    if (!isHex(value, { strict: true })) {
      throw new Error("The provided value is not a valid hex string.");
    }
  }
  return value;
};

const inputParamValueValidator = (value: string, abiSingularType: string) => {
  try {
    let parsedValue = parseAbiInputValue(value, abiSingularType);
    encodeAbiParameters([{ type: abiSingularType }], [parsedValue]);
    return { isInvalid: false, errorMessage: "" };
  } catch (e: any) {
    console.log(e);
    return {
      isInvalid: true,
      errorMessage:
        e?.shortMessage || e?.message || "There was an error parsing the parameter value.",
    };
  }
};

/**
 * Component to input parameters for an ABI function option.
 */
export default function FunctionOptionInputParams({
  functionOption,
}: {
  functionOption: AbiFunctionOption;
}) {
  const [inputParams, setInputParams] = useState<AbiFunctionInputParam[]>([]);

  const isUnsupported: boolean = useMemo(() => {
    return functionOption.inputs.some((param) => param.type.startsWith("tuple"));
  }, [functionOption]);

  // Reset the inputParams when the function option changes
  useEffect(() => {
    const newInputParams: AbiFunctionInputParam[] = [];
    if (functionOption) {
      for (let i = 0; i < functionOption.inputs.length; i++) {
        const abiParam = functionOption.inputs[i];
        const arrayComponents = getArrayComponents(abiParam.type);
        const newInputParam: AbiFunctionInputParam = {
          ...abiParam,
          arrayComponents,
          valueItems: arrayComponents
            ? Array.apply(null, Array(arrayComponents[0] || 1)).map(() => ({ value: "" }))
            : [{ value: "" }],
        };
        newInputParams.push(newInputParam);
      }
    }
    setInputParams(newInputParams);
  }, [functionOption]);

  useEffect(() => console.log("Input Params", inputParams), [inputParams]);

  return (
    <>
      {isUnsupported ? (
        <p className="text-red-300">
          The selected function uses "tuple" types, which are not currently supported.
        </p>
      ) : (
        inputParams.map((inputParam, index) => {
          return (
            <AbiFunctionInputParam
              key={index}
              inputParam={inputParam}
              // index={index}
              setInputParams={setInputParams}
            />
          );
        })
      )}
    </>
  );
}

function AbiFunctionInputParam({
  inputParam,
  // inputParams,
  // index,
  setInputParams,
}: {
  inputParam: AbiFunctionInputParam;
  // inputParams: AbiFunctionInputParam[];
  // index: number;
  setInputParams: Dispatch<SetStateAction<AbiFunctionInputParam[]>>;
}) {
  const [label] = useMemo(() => {
    return [`${inputParam.type} ${inputParam.name}`, inputParam.type];
  }, [inputParam]);

  const abiSingularType = useMemo(() => {
    return inputParam.arrayComponents?.[1] || inputParam.type;
  }, [inputParam]);

  const BaseComponent = useMemo(
    () => (inputParam.type.startsWith("string") ? Textarea : Input),
    [inputParam.type],
  );

  const { arrayComponents } = inputParam;

  return (
    <>
      {arrayComponents && <p>{label}</p>}
      {inputParam.valueItems.map((item, i) => {
        return (
          <Input
            className={`${arrayComponents ? "pl-4" : ""}`}
            key={i}
            label={arrayComponents ? `${inputParam.name}[${i}]` : label}
            value={item.value}
            errorMessage={item.errorMessage}
            onValueChange={(value) => {
              inputParam.valueItems[i] = {
                value,
                ...inputParamValueValidator(value, abiSingularType),
              };
              setInputParams((prev) => [...prev]);
            }}
          />
        );
      })}
      {arrayComponents && arrayComponents[0] === null && (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            className=""
            onPress={() => {
              inputParam.valueItems.push({ value: "" });
              setInputParams((prev) => [...prev]);
            }}
          >
            Add
          </Button>
          {inputParam.valueItems.length > 0 && (
            <Button
              size="sm"
              className="text-danger-300"
              onPress={() => {
                if (inputParam.valueItems.length > 0) {
                  inputParam.valueItems = inputParam.valueItems.slice(
                    0,
                    inputParam.valueItems.length - 1,
                  );
                }
                setInputParams((prev) => [...prev]);
              }}
            >
              Remove
            </Button>
          )}
        </div>
      )}
    </>
  );
}
