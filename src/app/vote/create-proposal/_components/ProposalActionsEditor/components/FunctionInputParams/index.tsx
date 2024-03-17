"use client";

import InputExtended from "@/components/_nextui/InputExtended";
import TextareaExtended from "@/components/_nextui/TextareaExtended";
import {
  AbiFunctionInputParam,
  AbiFunctionInputParamValueItem,
  AbiFunctionOption,
} from "../../types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { encodeAbiParameters, isHex } from "viem";
import { Button, TextAreaProps } from "@nextui-org/react";
import { getArrayComponents, parseAbiInputValue } from "@/utils/abi";

const processInputParamValue = (
  value: string,
  abiSingularType: string,
): AbiFunctionInputParamValueItem => {
  const returnError = (errorMessage: string) => {
    return {
      value,
      parsedValue: undefined,
      isInvalid: true,
      errorMessage,
    };
  };
  // Empty string, isInvalid but no error message necessary
  if (!value) {
    return returnError("");
  }
  try {
    let parsedValue = parseAbiInputValue(value, abiSingularType);
    encodeAbiParameters([{ type: abiSingularType }], [parsedValue]);
    return { value, parsedValue, isInvalid: false, errorMessage: "" };
  } catch (e: any) {
    return returnError(
      e?.shortMessage || e?.message || "There was an error parsing the parameter value.",
    );
  }
};

/**
 * Component to input parameters for an ABI function option.
 */
export default function FunctionInputParams({
  functionOption,
  inputParams,
  setInputParams,
}: {
  functionOption: AbiFunctionOption;
  inputParams: AbiFunctionInputParam[];
  setInputParams: Dispatch<SetStateAction<AbiFunctionInputParam[]>>;
}) {
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
            ? Array.apply(null, Array(arrayComponents[0] || 1)).map(() => ({
                value: "",
                isInvalid: true,
              }))
            : [{ value: "", isInvalid: true }],
        };
        newInputParams.push(newInputParam);
      }
    }
    setInputParams(newInputParams);
  }, [functionOption]);

  return (
    <>
      {isUnsupported ? (
        <p className="text-red-300">
          The selected function uses {`"tuple"`} types, which are not currently supported.
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
  setInputParams,
}: {
  inputParam: AbiFunctionInputParam;
  setInputParams: Dispatch<SetStateAction<AbiFunctionInputParam[]>>;
}) {
  const [label] = useMemo(() => {
    return [`${inputParam.type} ${inputParam.name}`, inputParam.type];
  }, [inputParam]);

  const abiSingularType = useMemo(() => {
    return inputParam.arrayComponents?.[1] || inputParam.type;
  }, [inputParam]);

  const BaseComponent = useMemo(
    () =>
      inputParam.type.startsWith("string")
        ? (props: TextAreaProps) => (
            <TextareaExtended
              minRows={1}
              maxRows={6}
              // disableAutosize
              // disableAnimation
              // classNames={{ input: "resize-y min-h-8" }}
              {...props}
            />
          )
        : InputExtended,
    [inputParam.type],
  );

  const { arrayComponents } = inputParam;

  return (
    <>
      {arrayComponents && <p>{label}</p>}
      {inputParam.valueItems.map((item, i) => {
        return (
          <BaseComponent
            className={`${arrayComponents ? "pl-4" : ""}`}
            key={i}
            label={arrayComponents ? `${inputParam.name}[${i}]` : label}
            value={item.value}
            errorMessage={item.errorMessage}
            onValueChange={(value) => {
              inputParam.valueItems[i] = processInputParamValue(value, abiSingularType);
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
