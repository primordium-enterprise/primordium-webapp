"use client";

import Input from "@/components/Input";
import { AbiFunctionOption } from "../../types";
import { Dispatch, useEffect, useMemo, useReducer } from "react";
import { AbiParameter, BaseError, encodeAbiParameters } from "viem";

interface AbiFunctionInputParams {
  [inputIndex: number]: {
    value: string;
    isInvalid?: boolean;
    errorMessage?: string;
  };
}

const inputParamsReducer = (
  state: AbiFunctionInputParams,
  update: { type?: "reset"; payload: AbiFunctionInputParams },
): AbiFunctionInputParams => {
  const { type, payload } = update;
  if (type === "reset") {
    return payload;
  }

  let newState = { ...state };
  for (let paramIndex in payload) {
    newState[paramIndex] = { ...newState[paramIndex], ...payload[paramIndex] };
  }
  return newState;
};

const validateInputParamValue = (
  functionOption: AbiFunctionOption,
  inputIndex: number,
  value: string,
) => {
  const arrayComponents = functionOption.arrayComponentsByInputIndex[inputIndex];
  const type: string = arrayComponents?.[1] || functionOption.inputs[inputIndex].type;
  console.log(type);
  let formattedValue: any = value;

  try {
    console.log(JSON.parse(value));
    console.log(value);
  } catch {}
  if (functionOption.arrayComponentsByInputIndex[inputIndex]) {
    try {
      formattedValue = JSON.parse(value);
      if (!Array.isArray(formattedValue)) {
        throw new Error("Value must be an array.");
      }
    } catch (e: any) {
      console.log(e);
      return {
        isInvalid: true,
        errorMessage: e?.message ||
          "Array values must be formatted as a comma seperated list with square brackets.",
      };
    }
  }

  try {
    encodeAbiParameters([functionOption.inputs[inputIndex]], [formattedValue]);
    return { isInvalid: false, errorMessage: "" };
  } catch (e) {
    return { isInvalid: true, errorMessage: (e as BaseError)?.shortMessage || "There was an error encoding the parameter." };
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
  const [inputParams, dispatchInputParamsUpdate] = useReducer(inputParamsReducer, {});

  const isUnsupported: boolean = useMemo(() => {
    return functionOption?.inputs.some((param) => param.type.startsWith("tuple")) || false;
  }, [functionOption]);

  // Reset the inputParams when the function option changes
  useEffect(() => {
    let payload = {};
    if (functionOption) {
      payload = functionOption.inputs.reduce(
        (acc, param, index) => ({
          ...acc,
          [index]: {
            value: "",
          },
        }),
        {},
      );
    }
    dispatchInputParamsUpdate({ type: "reset", payload });
  }, [functionOption]);

  useEffect(() => console.log("Input Params", inputParams), [inputParams]);

  return (
    <>
      {isUnsupported ? (
        <p className="text-red-300">
          The selected function uses "tuple" types, which are not currently supported.
        </p>
      ) : (
        functionOption.inputs.map((param, index) => (
          <Input
            key={index}
            label={`${param.type} ${param.name}`}
            value={inputParams[index]?.value || ""}
            errorMessage={inputParams[index]?.errorMessage}
            onValueChange={(value) => {
              let payload = {
                [index]: { value, ...validateInputParamValue(functionOption, index, value) },
              };
              dispatchInputParamsUpdate({ payload });
            }}
          />
        ))
      )}
    </>
  );
}
