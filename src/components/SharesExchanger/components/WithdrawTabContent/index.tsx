import AssetAmountInput from "@/components/AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import { ChooseWalletModalContext } from "@/context/ChooseWalletModal";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import parseDnumFromString from "@/utils/parseDnumFromString";
import { Button, Slider, input, slider } from "@nextui-org/react";
import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { format as dnFormat } from "dnum";

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
      setSliderValue(
        Number((value * BigInt(MULT)) / mushiBalance) / MULT,
      );
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
      let value =
        (BigInt((sliderValue as number) * MULT) * mushiBalance) /
        BigInt(MULT);
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

  return isConnected ? (
    <>
      <p className="mb-2 text-sm text-default-400">
        <span className="text-warning-400">WAIT, THINK TWICE!</span> Withdrawing burns your MUSHI
        share tokens. Only proceed if you wish to dissolve some or all of your membership:
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
      <Button className="mt-2" color="warning" size="lg" fullWidth isDisabled={!isReady}>
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
