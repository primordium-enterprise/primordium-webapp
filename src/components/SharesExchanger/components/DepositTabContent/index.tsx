import { useCallback, useContext, useMemo, useState } from "react";
import { Button, Checkbox, Input, Switch, Tab } from "@nextui-org/react";
import AssetAmountInput from "@/components/AssetAmountInput";
import chainConfig from "@/config/chainConfig";
import { sharePrice } from "@/config/primordiumSettings";
import parseDnumFromString from "@/utils/parseDnumFromString";
import { Dnum, format as dnFormat } from "dnum";
import { Address, isAddress, isAddressEqual } from "viem";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { ADDRESS_ZERO } from "@/utils/constants";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import PrimordiumSharesOnboarderV1Abi from "@/abi/PrimordiumSharesOnboarderV1.abi";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import shortenAddress from "@/utils/shortenAddress";
import PrimordiumTokenV1Abi from "@/abi/PrimordiumTokenV1.abi";
import combineAbiErrors from "@/utils/combineAbiErrors";
import PrimordiumExecutorV1Abi from "@/abi/PrimordiumExecutorV1.abi";
import handleViemContractError from "@/utils/handleViemContractError";

const pruneCommas = (value: string): string => {
  return value.replaceAll(",", "");
};

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
  const { address, isConnected } = useAccount();
  const {
    value: balance,
    queryResult: { refetch: refetchEthBalance },
  } = useFormattedBalance({ address });
  const {
    queryResult: { refetch: refetchMushiBalance },
  } = useFormattedBalance({ address, token: chainConfig.addresses.token });

  const { open } = useWeb3Modal();

  const { addTransaction } = useContext(LocalTransactionsContext);

  const [depositValue, _setDepositValue] = useState(sharePrice.quoteAmount.toString());
  const setDepositValue = useCallback(
    (value: string) => _setDepositValue(pruneCommas(value)),
    [_setDepositValue],
  );
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

  const [mintValue, _setMintValue] = useState(sharePrice.mintAmount.toString());
  const setMintValue = useCallback(
    (value: string) => _setMintValue(pruneCommas(value)),
    [_setMintValue],
  );
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
    return isAddress(mintTo) && !isAddressEqual(mintTo, ADDRESS_ZERO);
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

  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const mint = () => {
    const toastId = toast.loading("Sending deposit transaction...");
    let depositAmount = parseDnumFromString(depositValue)[0];
    let description = `Deposit ${depositValue.slice()} ETH for ${mintValue.slice()} MUSHI tokens${isMintToSelected ? ` (minted to ${shortenAddress(mintTo as Address)})` : ""}.`;

    writeContractAsync({
      address: chainConfig.addresses.sharesOnboarder,
      abi: [
        ...PrimordiumSharesOnboarderV1Abi,
        ...combineAbiErrors(PrimordiumExecutorV1Abi, PrimordiumTokenV1Abi),
      ],
      functionName: isMintToSelected ? "depositFor" : "deposit",
      args: isMintToSelected ? [mintTo as Address, depositAmount] : [depositAmount],
      value: depositAmount,
    })
      .then((hash) => {
        addTransaction(hash, description, toastId, () => {
          // Refetch balances on receipt
          refetchEthBalance();
          refetchMushiBalance();
        });
      })
      .catch((error) => handleViemContractError(error, toastId));
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
        token={chainConfig.addresses.token}
      />
      <Switch
        isSelected={isMintToSelected}
        onValueChange={setIsMintToSelected}
        className="mt-2"
        classNames={{
          label: `text-sm ${isMintToSelected ? "text-foreground" : "text-default-400"}`,
        }}
      >
        Mint shares to a different address
      </Switch>
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
          color="primary"
          isDisabled={isConnected && !isReady}
          onPress={isConnected ? mint : () => open()}
          isLoading={isWriteContractPending}
        >
          {!isConnected
            ? "Connect Wallet"
            : !isDepositAmount
              ? "Enter deposit amount"
              : !isSufficientBalance
                ? "Insufficient ETH balance"
                : "Mint shares"}
        </Button>
      </div>
    </>
  );
}
