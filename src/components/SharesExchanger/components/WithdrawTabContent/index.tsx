import AssetAmountInput from "@/components/AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import { ChooseWalletModalContext } from "@/context/ChooseWalletModal";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import parseDnumFromString from "@/utils/parseDnumFromString";
import { Button, ButtonGroup, Input, Slider, Spacer, input, slider } from "@nextui-org/react";
import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { format as dnFormat } from "dnum";
import { Address, isAddress } from "viem";
import { ADDRESS_ZERO } from "@/utils/constants";
import WithdrawAsset from "./components/WithdrawAsset";

const token = primordiumContracts.token.address;
const MULT = 1000;

export default function WithdrawTabContent() {
  const { address, isConnected } = useAccount();
  const { value: mushiBalance, decimals } = useFormattedBalance({ address, token });

  const { onOpen } = useContext(ChooseWalletModalContext);

  const [withdrawInputValue, setWithdrawInputValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState(BigInt(0));
  const onWithdrawInputValueChange = (inputValue: string) => {
    let value = parseDnumFromString(inputValue, decimals)[0];
    setWithdrawValue(value);
    if (mushiBalance > 0) {
      setSliderValue(Number((value * BigInt(MULT)) / mushiBalance) / MULT);
    }
    setWithdrawInputValue(inputValue);
  };

  const [sliderValue, setSliderValue] = useState(0);
  const onSliderValueUpdate = (sliderValue: number | number[]) => {
    if (sliderValue === 1) {
      let value = mushiBalance;
      setWithdrawValue(value);
      setWithdrawInputValue(dnFormat([value, decimals]));
    } else if (sliderValue === 0) {
      setWithdrawValue(BigInt(0));
      setWithdrawInputValue("0");
    } else {
      let value = (BigInt((sliderValue as number) * MULT) * mushiBalance) / BigInt(MULT);
      setWithdrawValue(value);
      setWithdrawInputValue(dnFormat([value, decimals]));
    }
    setSliderValue(sliderValue as number);
  };

  const [isWithdrawAmount, isInsufficientBalance] = useMemo(() => {
    return [withdrawValue > 0, withdrawValue > mushiBalance];
  }, [withdrawValue, mushiBalance]);

  const isReady = useMemo(() => {
    return isWithdrawAmount && !isInsufficientBalance;
  }, [isWithdrawAmount, isInsufficientBalance]);

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAssetAddress, setNewAssetAddress] = useState("");
  const isNewAssetAddressValid = useMemo(() => {
    if (newAssetAddress) {
      return isAddress(newAssetAddress);
    }
    return true;
  }, [newAssetAddress]);

  const [assets, setAssets] = useState<Address[]>([ADDRESS_ZERO]); // Defaults to address(0) for ETH
  const addNewAssetAddress = () => {
    if (isNewAssetAddressValid) {
      if (!assets.find((asset) => asset === newAssetAddress)) {
        setAssets([...assets, newAssetAddress as Address]);
      }
      setNewAssetAddress("");
      setIsAddingAsset(false);
    }
  };

  const removeAsset = (asset: Address) => {
    setAssets(assets.filter(a => a !== asset))
  }

  return isConnected ? (
    <>
      <p className="mb-2 text-sm text-default-400">
        <span className="text-warning-400">BE AWARE:</span> Withdrawing burns your MUSHI share
        tokens. Only proceed if you wish to dissolve some or all of your membership:
      </p>

      <AssetAmountInput
        value={withdrawInputValue}
        onValueChange={onWithdrawInputValueChange}
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

      <p className="my-4 text-sm text-foreground">Treasury assets to withdraw:</p>

      {assets.map((asset) => (
        <WithdrawAsset asset={asset} removeAsset={removeAsset} />
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

      <Button className="mb-2 mt-4" color="warning" size="lg" fullWidth isDisabled={!isReady}>
        {isInsufficientBalance ? "Insufficient Balance" : "Withdraw shares"}
      </Button>
    </>
  ) : (
    <>
      <p className="text-sm text-default-400">
        Connect your wallet to view your membership shares:
      </p>
      <Button className="my-2" fullWidth onPress={onOpen} size="lg" color="primary">
        Connect Wallet
      </Button>
    </>
  );
}
