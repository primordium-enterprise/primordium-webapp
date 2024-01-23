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
import fallbackLogo from "public/img/asset-logos/fallbackLogo.svg";

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
            <div className="flex flex-col xs:flex-row justify-between items-center">
              <div className="flex xs:flex-col">
                <div className="flex items-center">
                  <Image
                    src={logoSrc}
                    unoptimized
                    alt="ERC20 asset logo"
                    width={128}
                    height={128}
                    className="mr-2 size-5 rounded-full"
                    onError={() => setLogoSrc(fallbackLogo)}
                  />
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
              <div className="flex flex-col text-right">
                <span className="text-sm text-right">Estimated Payout: {estPayoutFormatted}</span>
                <Spacer />
                <span className="text-xs text-default-500 text-right">Treasury Balance: {formatted}</span>
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
