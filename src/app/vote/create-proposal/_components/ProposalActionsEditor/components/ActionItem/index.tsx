"use client";

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { AbiFunctionInputParam, ProposalAction, actionTypeDisplays } from "../../types";
import { useMemo, useState } from "react";
import { formatEther } from "viem";
import DisplayAddress from "@/components/DisplayAddress";
import ButtonExtended from "@/components/_nextui/ButtonExtended";

export default function ActionItem({
  action,
  index,
  removeAction,
}: {
  action: ProposalAction;
  index: number;
  removeAction: () => void;
}) {
  const ethDisplay = useMemo(() => formatEther(action.value), [action]);

  const { abi, abiFunctionInputParams: inputParams } = action;
  const hasInputParams = useMemo(() => inputParams && inputParams.length > 0, [inputParams]);
  const [showParams, setShowParams] = useState(false);

  const [confirmDeleteAction, setConfirmDeleteAction] = useState(false);

  return (
    <Card>
      <CardBody className="flex flex-col gap-2 text-2xs xs:text-xs">
        <div className="text-foreground-500">{`${index + 1})`}</div>
        <div className="text-xs xs:text-sm">
          Action Type:{" "}
          <span className="text-foreground-500">{actionTypeDisplays[action.actionType]}</span>
        </div>
        <div className="ml-2 flex flex-col gap-1">
          <div className="flex gap-4">
            <p>{action.actionType === "value" ? "Sending to:" : "Target Contract:"}</p>
            <DisplayAddress
              className="text-foreground-500"
              address={action.target}
              skipEns
              enableClickToCopy
            />
          </div>
          <div className="flex gap-4">
            <p>{action.actionType === "value" ? "ETH amount:" : "Value (ETH):"}</p>
            <p className="text-foreground-500">{ethDisplay}</p>
          </div>
          {abi && (
            <>
              <div className="flex gap-4">
                <p>Function:</p>
                <p className="text-foreground-500">{action.signature}</p>
              </div>
              {showParams && hasInputParams && (
                <div className="ml-2 flex flex-col gap-2">
                  {inputParams!.map((param, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <p className="text-foreground-700">{`${param.type} ${param.name}`}</p>
                      <div className="ml-2 flex flex-col gap-1 text-foreground-500">
                        {param.valueItems.length > 0 ? (
                          param.valueItems.map((item, i) => (
                            <p key={`value-item-${i}`} className="whitespace-nowrap">
                              {item.value}
                            </p>
                          ))
                        ) : (
                          <p>(empty)</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {hasInputParams && (
                <p
                  className="ml-2 text-primary hover:cursor-pointer"
                  onClick={() => setShowParams(!showParams)}
                >
                  {showParams ? "Hide function params" : "Expand function params"}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end gap-2">
          {confirmDeleteAction && (
            <ButtonExtended
              size="sm"
              color="danger"
              onPress={() => {
                setConfirmDeleteAction(false);
                removeAction();
              }}
            >
              Remove Action
            </ButtonExtended>
          )}
          <ButtonExtended size="sm" onPress={() => setConfirmDeleteAction(!confirmDeleteAction)}>
            {confirmDeleteAction ? "Cancel" : "Remove Action"}
          </ButtonExtended>
        </div>
      </CardBody>
    </Card>
  );
}
