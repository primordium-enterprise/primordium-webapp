"use client";

import { chainConfig } from "@/config/chainConfig";
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
import { useChainId } from "wagmi";

export default function WithdrawAsset({
  asset,
  removeAsset,
  withdrawValue,
  refetchCount,
}: {
  asset: Address;
  removeAsset: (asset: Address) => void;
  withdrawValue: bigint;
  refetchCount: number;
}) {
  const chainId = useChainId();
  const { totalSupply, refetch: refetchTotalSupply } = useTotalSupply(
    chainConfig[chainId]?.addresses.token,
  );
  const {
    value: assetBalance,
    symbol,
    decimals,
    formatted,
    queryResult: { refetch: refetchAssetBalance },
  } = useFormattedBalance({
    address: chainConfig[chainId]?.addresses.executor,
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
            <div className="flex flex-col items-center justify-between xs:flex-row">
              <div className="flex xs:flex-col">
                <div className="mr-2 flex items-center xs:mr-0">
                  <ERC20AssetLogo asset={asset} className="mr-2 size-5 rounded-full" />
                  <span className="text-md text-foreground">{symbol}</span>
                </div>
                <Spacer />
                <Button
                  size="sm"
                  className="m-0 px-unit-2 font-roboto-mono text-xs text-default-500"
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
              <div className="mt-2 flex flex-col text-center xs:mt-0 xs:text-right">
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
