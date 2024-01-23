'use client'

import { Button, ButtonGroup, Card, CardBody, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Address } from "viem";

export default function WithdrawAsset({
  asset,
  removeAsset
}: {
  asset: Address,
  removeAsset: (asset: Address) => void
}) {
  return (
    <Popover backdrop="opaque">
      <PopoverTrigger>
      <Card className="bg-content2 mt-2 hover:cursor-pointer hover:bg-content3">
        <CardBody>
          {asset}
        </CardBody>
      </Card>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Button variant="light" color="danger" onPress={() => removeAsset(asset)}>Remove Asset</Button>
      </PopoverContent>
    </Popover>
  );
}