"use client";

import primordiumContracts from "@/config/primordiumContracts";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import useTotalSupply from "@/hooks/useTotalSupply";
import getAssetLogoSrc from "@/utils/getAssetLogoSrc";
import shortenAddress from "@/utils/shortenAddress";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@nextui-org/react";
import { CopyIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address } from "viem";
import { format } from "dnum";

export default function WithdrawAsset({
  asset,
  removeAsset,
  mushiBalance,
}: {
  asset: Address;
  removeAsset: (asset: Address) => void;
  mushiBalance: bigint;
}) {
  const { totalSupply } = useTotalSupply();
  const {
    value: assetBalance,
    symbol,
    decimals,
    formatted,
  } = useFormattedBalance({
    address: primordiumContracts.executor.address,
    token: asset,
  });
  const [logoSrc, setLogoSrc] = useState(getAssetLogoSrc(asset));
  const shortenedAsset = useMemo(() => shortenAddress(asset), [asset]);

  const estPayoutFormatted = useMemo(() => {
    if (!totalSupply) return "0";
    return format([(assetBalance * mushiBalance) / totalSupply, decimals]);
  }, [mushiBalance, totalSupply, assetBalance, decimals]);

  return (
    <Popover backdrop="opaque">
      <PopoverTrigger>
        <Card className="mt-2 bg-content2 hover:cursor-pointer hover:bg-content3">
          <CardBody>
            <div className="xs:flex-row flex flex-col items-center justify-between">
              <div className="xs:flex-col flex">
                <div className="xs:mr-0 mr-2 flex items-center">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      unoptimized
                      alt="ERC20 asset logo"
                      width={128}
                      height={128}
                      className="mr-2 size-5 rounded-full"
                      onError={() => setLogoSrc("")}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={`#${asset.slice(asset.length - 6)}`}
                      className="bi bi-circle-fill mr-2 size-5"
                      viewBox="0 0 16 16"
                    >
                      <circle cx="8" cy="8" r="8" />
                    </svg>
                  )}
                  <span className="text-md text-foreground">{symbol}</span>
                </div>
                <Spacer />
                <Button
                  size="sm"
                  className="m-0 px-unit-2 text-xs text-default-500"
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
