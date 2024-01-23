import { useMemo, useState } from "react";
import { Button, Checkbox, Input, Tab } from "@nextui-org/react";
import AssetAmountInput from "@/components/AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import { sharePrice } from "@/config/primordiumSettings";
import parseDnumFromString from "@/utils/parseDnumFromString";
import { Dnum, format as dnFormat } from "dnum";
import { Hash, isAddress } from "viem";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import {
  useAccount,
  useChainId,
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import toast from "react-hot-toast";
import { getChainId, waitForTransactionReceipt } from "wagmi/actions";
import { Link } from "@nextui-org/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { sepolia } from "viem/chains";

const roundRemainderDown = (value: Dnum, divisor: number | bigint): Dnum => {
  divisor = BigInt(divisor);
  let remainder = value[0] % divisor;
  if (remainder !== BigInt(0)) {
    return [value[0] - remainder, value[1]];
  }
  return value;
};

export default function DepositTabContent() {
  const chainId = useChainId();
  const config = useConfig();
  const { address } = useAccount();
  const {
    value: balance,
    result: { refetch: refetchEthBalance },
  } = useFormattedBalance({ address });
  const {
    result: { refetch: refetchMushiBalance },
  } = useFormattedBalance({ address, token: primordiumContracts.token.address });

  const [depositValue, setDepositValue] = useState("");
  const onDepositChange = (value: string) => {
    if (value) {
      let v = parseDnumFromString(value);
      let r = roundRemainderDown(v, sharePrice.quoteAmount);
      if (v[0] !== r[0]) {
        value = dnFormat(r);
      }
      setMintValue(dnFormat([(r[0] * sharePrice.mintAmount) / sharePrice.quoteAmount, r[1]]));
    } else {
      setMintValue("");
    }
    setDepositValue(value);
  };

  const [mintValue, setMintValue] = useState("");
  const onMintChange = (value: string) => {
    if (value) {
      let v = parseDnumFromString(value);
      let r = roundRemainderDown(v, sharePrice.mintAmount);
      if (v[0] !== r[0]) {
        value = dnFormat(r);
      }
      setDepositValue(dnFormat([(r[0] * sharePrice.quoteAmount) / sharePrice.mintAmount, r[1]]));
    } else {
      setDepositValue("");
    }
    setMintValue(value);
  };

  const [isMintToSelected, setIsMintToSelected] = useState(false);
  const [mintTo, setMintTo] = useState("");

  const isMintToValid = useMemo(() => {
    if (mintTo === "") return true;
    return isAddress(mintTo);
  }, [mintTo]);

  const isMintToReady = useMemo(() => {
    return !isMintToSelected || (mintTo && isMintToValid);
  }, [isMintToSelected, mintTo, isMintToValid]);

  const [isDepositAmount, isSufficientBalance] = useMemo(() => {
    let deposit = parseDnumFromString(depositValue);
    return [deposit[0] > BigInt(0), deposit[0] <= balance];
  }, [depositValue, balance]);

  const isReady = useMemo(() => {
    return isMintToReady && isDepositAmount && isSufficientBalance;
  }, [isMintToReady, isDepositAmount, isSufficientBalance]);

  const [txHash, setTxHash] = useState<Hash | undefined>();
  const { writeContractAsync, isPending, isError, data, error } = useWriteContract();

  const mint = () => {
    const toastId = toast.loading("Sending transaction...");

    let depositAmount = parseDnumFromString(depositValue)[0];
    let tx = writeContractAsync({
      ...primordiumContracts.sharesOnboarder,
      functionName: isMintToSelected ? "depositFor" : "deposit",
      args: isMintToSelected ? [mintTo, depositAmount] : [depositAmount],
      value: depositAmount,
    })
      .then((hash) => {
        toast.loading("Waiting for transaction receipt...", { id: toastId });
        return waitForTransactionReceipt(config, { hash });
      })
      .then((receipt) => {
        // Refetch balances
        refetchEthBalance();
        refetchMushiBalance();

        // Update the toast
        toast.success(
          <div className="flex items-start">
            <span>
              Transaction success!
              <br />
              <Link
                isExternal
                showAnchorIcon
                href={`https://${chainId == sepolia.id ? "sepolia." : ""}etherscan.io/tx/${receipt.transactionHash}`}
              >
                View on etherscan
              </Link>
            </span>
          </div>,
          { id: toastId, duration: Infinity },
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to submit the transaction.", { id: toastId });
      });
  };

  return (
    <>
      <AssetAmountInput
        value={depositValue}
        onValueChange={onDepositChange}
        label="Deposit amount"
      />
      <AssetAmountInput
        value={mintValue}
        onValueChange={onMintChange}
        label="Mint amount"
        token={primordiumContracts.token.address}
      />
      <Checkbox
        isSelected={isMintToSelected}
        onValueChange={setIsMintToSelected}
        classNames={{
          label: `text-sm ${isMintToSelected ? "text-foreground" : "text-default-400"}`,
        }}
      >
        Mint shares to a different address
      </Checkbox>
      {isMintToSelected && (
        <Input
          value={mintTo}
          onValueChange={setMintTo}
          className="mt-2"
          label="Mint to:"
          isInvalid={!isMintToValid}
          variant="faded"
        />
      )}
      <div className="mt-4 flex items-center justify-end">
        <Button
          className="w-full"
          size="lg"
          color={isReady ? "primary" : "default"}
          isDisabled={!isReady}
          onPress={mint}
          isLoading={isPending}
        >
          {!isDepositAmount
            ? "Enter deposit amount"
            : !isSufficientBalance
              ? "Insufficient ETH balance"
              : "Mint shares"}
        </Button>
      </div>
    </>
  );
}
