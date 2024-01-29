"use client";

import primordiumContracts from "@/config/primordiumContracts";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import useTotalSupply from "@/hooks/useTotalSupply";
import shortenAddress from "@/utils/shortenAddress";
import {
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@nextui-org/react";
import { CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Address } from "viem";
import { format } from "dnum";
import ERC20AssetLogo from "@/components/ERC20AssetLogo";

export default function WithdrawAsset({
  asset,
  removeAsset,
  withdrawValue,
  refetchCount
}: {
  asset: Address;
  removeAsset: (asset: Address) => void;
  withdrawValue: bigint;
  refetchCount: number
}) {
  const { totalSupply, refetch: refetchTotalSupply } = useTotalSupply();
  const {
    value: assetBalance,
    symbol,
    decimals,
    formatted,
    result: { refetch: refetchAssetBalance }
  } = useFormattedBalance({
    address: primordiumContracts.executor.address,
    token: asset,
  });

  const shortenedAsset = useMemo(() => shortenAddress(asset), [asset]);

  useEffect(() => {
    refetchAssetBalance({ cancelRefetch: false });
    refetchTotalSupply({ cancelRefetch: false });
  }, [refetchCount]);

  const estPayoutFormatted = useMemo(() => {
    if (!totalSupply) return "0";
    return format([(assetBalance * withdrawValue) / totalSupply, decimals]);
  }, [withdrawValue, totalSupply, assetBalance, decimals]);

  return (
    <Popover backdrop="opaque">
      <PopoverTrigger>
        <Card className="mt-2 bg-content2 hover:cursor-pointer hover:bg-content3">
          <CardBody>
            <div className="xs:flex-row flex flex-col items-center justify-between">
              <div className="xs:flex-col flex">
                <div className="xs:mr-0 mr-2 flex items-center">
                  <ERC20AssetLogo asset={asset} className="mr-2 size-5 rounded-full" />
                  <span className="text-md text-foreground">{symbol}</span>
                </div>
                <Spacer />
                <Button
                  size="sm"
                  className="m-0 px-unit-2 text-xs text-default-500 font-roboto-mono"
                  variant="faded"
                  endContent={<CopyIcon />}
                  onPress={() => {
                    if (navigator) {
                      navigator.clipboard.writeText(asset);
                      toast.success("Copied address to clipboard!", {
                        id: "clipboard",
                        duration: 2000,
                        position: "bottom-center",
                      });
                    }
                  }}
                >
                  {shortenedAsset}
                </Button>
              </div>
              <div className="xs:mt-0 xs:text-right mt-2 flex flex-col text-center">
                <span className="text-sm">Estimated Payout: {estPayoutFormatted}</span>
                <Spacer />
                <span className="text-xs text-default-500">Treasury Balance: {formatted}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Button variant="light" color="danger" onPress={() => removeAsset(asset)}>
          Remove Asset
        </Button>
      </PopoverContent>
    </Popover>
  );
}
