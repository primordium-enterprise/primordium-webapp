import AssetAmountInput from "@/components/AssetAmountInput";
import {primordiumAddresses} from "@/config/addresses";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import parseDnumFromString from "@/utils/parseDnumFromString";
import {
  Button,
  ButtonGroup,
  Input,
  Link,
  Slider,
  Spacer,
  Switch,
  input,
  slider,
} from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId, useConfig, useWriteContract } from "wagmi";
import { format as dnFormat } from "dnum";
import { Address, isAddress, isAddressEqual, keccak256, toHex } from "viem";
import { ADDRESS_ZERO } from "@/utils/constants";
import WithdrawAsset from "./components/WithdrawAsset";
import toast from "react-hot-toast";
import { waitForTransactionReceipt } from "wagmi/actions";
import { sepolia } from "viem/chains";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import PrimordiumTokenV1Abi from "@/abi/PrimordiumTokenV1.abi";

const MULT = 1000;

const ASSETS_STORAGE_KEY = keccak256(toHex("WITHDRAWAL ASSETS"));
const defaultAssetsJSON = JSON.stringify([ADDRESS_ZERO]);

const pruneCommas = (value: string) => {
  return value.replaceAll(",", "");
};

export default function WithdrawTabContent() {
  const config = useConfig();
  const chainId = useChainId();

  const token = primordiumAddresses[chainId].token;

  const { address, isConnected } = useAccount();
  const { refetch: refetchEthBalance } = useBalance({ address });
  const {
    value: mushiBalance,
    decimals,
    result: { refetch: refetchMushiBalance },
  } = useFormattedBalance({ address, token });

  const { open } = useWeb3Modal();

  const [withdrawInputValue, setWithdrawInputValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState(BigInt(0));
  const onWithdrawToInputValueChange = (inputValue: string) => {
    let value = parseDnumFromString(inputValue, decimals)[0];
    setWithdrawValue(value);
    if (mushiBalance > 0) {
      setSliderValue(Number((value * BigInt(MULT)) / mushiBalance) / MULT);
    }
    setWithdrawInputValue(inputValue);
  };

  const [refetchCount, setRefetchCount] = useState(0);
  useEffect(() => {
    refetchEthBalance({ cancelRefetch: false });
    refetchMushiBalance({ cancelRefetch: false });
  }, [refetchCount]);

  const [sliderValue, setSliderValue] = useState(0);
  const onSliderValueUpdate = (sliderValue: number | number[]) => {
    if (sliderValue === 1) {
      let value = mushiBalance;
      setWithdrawValue(value);
      setWithdrawInputValue(pruneCommas(dnFormat([value, decimals])));
    } else if (sliderValue === 0) {
      setWithdrawValue(BigInt(0));
      setWithdrawInputValue("0");
    } else {
      let value = (BigInt((sliderValue as number) * MULT) * mushiBalance) / BigInt(MULT);
      setWithdrawValue(value);
      setWithdrawInputValue(pruneCommas(dnFormat([value, decimals])));
    }
    setSliderValue(sliderValue as number);
  };

  const [isWithdrawAmount, isInsufficientBalance] = useMemo(() => {
    return [withdrawValue > 0, withdrawValue > mushiBalance];
  }, [withdrawValue, mushiBalance]);

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAssetAddress, setNewAssetAddress] = useState("");
  const isNewAssetAddressValid = useMemo(() => {
    if (newAssetAddress) {
      return isAddress(newAssetAddress);
    }
    return true;
  }, [newAssetAddress]);

  const [isWithdrawToSelected, setIsWithdrawToSelected] = useState(false);
  const [withdrawTo, setWithdrawTo] = useState("");

  const isWithdrawToValid = useMemo(() => {
    if (withdrawTo === "") return true;
    return isAddress(withdrawTo) && !isAddressEqual(withdrawTo, ADDRESS_ZERO);
  }, [withdrawTo]);

  const isWithdrawToReady = useMemo(() => {
    return !isWithdrawToSelected || (withdrawTo && isWithdrawToValid);
  }, [isWithdrawToSelected, withdrawTo, isWithdrawToValid]);

  const [assets, setAssets] = useState<Address[]>(
    JSON.parse(window?.localStorage.getItem(ASSETS_STORAGE_KEY) || defaultAssetsJSON),
  );

  const addNewAssetAddress = () => {
    if (isNewAssetAddressValid) {
      if (!assets.find((asset) => asset === newAssetAddress)) {
        const newAssets: Address[] = [...assets, newAssetAddress as Address];
        setAssets(newAssets);
        if (window) {
          window.localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
        }
      }
      setNewAssetAddress("");
      setIsAddingAsset(false);
    }
  };

  const removeAsset = (asset: Address) => {
    const newAssets: Address[] = assets.filter((a) => a !== asset);
    setAssets(newAssets);
    if (window) {
      window.localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
    }
  };

  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const withdraw = () => {
    const toastId = toast.loading("Sending withdraw transaction...");

    let args: (bigint | Address | Address[])[] = [withdrawValue, assets];

    if (isWithdrawToSelected) {
      args.unshift(withdrawTo as Address);
    }

    writeContractAsync({
      address: primordiumAddresses[chainId].token,
      abi: PrimordiumTokenV1Abi,
      functionName: isWithdrawToSelected ? "withdrawTo" : "withdraw",
      args,
    })
      .then((hash) => {
        toast.loading("Waiting for transaction receipt...", { id: toastId });
        return waitForTransactionReceipt(config, { hash });
      })
      .then((receipt) => {
        // Refetch balances
        setRefetchCount(refetchCount + 1);

        onWithdrawToInputValueChange("");

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
        toast.error("Failed to submit the withdraw transaction.", { id: toastId });
      });
  };

  const isReady = useMemo(() => {
    return isWithdrawAmount && isWithdrawToReady && !isInsufficientBalance;
  }, [isWithdrawAmount, isWithdrawToReady, isInsufficientBalance]);

  return isConnected ? (
    <>
      <p className="mb-4 text-sm text-default-400">
        <span className="mb-1 text-warning-400 underline block">NOTE:</span>
        <span className="pl-2 block">
          Withdrawing burns your MUSHI share tokens. Only proceed if you wish to dissolve some or
          all of your membership.
        </span>
      </p>

      <AssetAmountInput
        value={withdrawInputValue}
        onValueChange={onWithdrawToInputValueChange}
        label="Withdraw amount"
        token={token}
      />

      {mushiBalance > 0 && (
        <Slider
          size="sm"
          step={1 / MULT}
          minValue={0}
          maxValue={1}
          hideValue
          value={sliderValue}
          onChange={onSliderValueUpdate}
          aria-label="Withdraw amount slider"
        />
      )}

      <Switch
        isSelected={isWithdrawToSelected}
        onValueChange={setIsWithdrawToSelected}
        color="warning"
        className="mt-4"
        classNames={{
          label: `text-sm ${isWithdrawToSelected ? "text-foreground" : "text-default-400"}`,
        }}
      >
        Withdraw assets to a different address
      </Switch>

      {isWithdrawToSelected && (
        <Input
          value={withdrawTo}
          onChange={(e) => {
            console.log(e.target.value);
          }}
          onValueChange={setWithdrawTo}
          className="mt-2"
          label="Withdraw assets to:"
          isInvalid={!isWithdrawToValid}
          variant="faded"
        />
      )}

      <p className="my-4 text-sm text-foreground">Treasury assets to withdraw:</p>

      {assets.map((asset) => (
        <WithdrawAsset
          key={asset}
          asset={asset}
          removeAsset={removeAsset}
          withdrawValue={withdrawValue}
          refetchCount={refetchCount}
        />
      ))}

      {isAddingAsset && (
        <Input
          value={newAssetAddress}
          onValueChange={setNewAssetAddress}
          size="sm"
          label="ERC20 Token address:"
          autoFocus
          variant="faded"
          isInvalid={!isNewAssetAddressValid}
          className="mt-4"
        />
      )}
      <div className="mt-2 flex justify-end">
        {isAddingAsset ? (
          <>
            <Button size="sm" variant="bordered" onPress={() => setIsAddingAsset(false)}>
              Cancel
            </Button>
            <Spacer />
            <Button size="sm" color="primary" onPress={addNewAssetAddress}>
              Add
            </Button>
          </>
        ) : (
          <Button color="primary" variant="ghost" size="sm" onPress={() => setIsAddingAsset(true)}>
            Add ERC20 Asset
          </Button>
        )}
      </div>

      <Button
        className="mb-2 mt-4"
        color="warning"
        size="lg"
        fullWidth
        isDisabled={!isReady}
        onPress={withdraw}
        isLoading={isWriteContractPending}
      >
        {isInsufficientBalance ? "Insufficient balance" : "Withdraw shares"}
      </Button>
    </>
  ) : (
    <>
      <p className="text-sm text-default-400">
        Connect your wallet to view your membership shares:
      </p>
      <Button className="my-2" fullWidth onPress={() => open()} size="lg" color="primary">
        Connect Wallet
      </Button>
    </>
  );
}
