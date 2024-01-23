import AssetAmountInput from "@/components/AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import { ChooseWalletModalContext } from "@/context/ChooseWalletModal";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import { Button } from "@nextui-org/react";
import { useContext, useState } from "react";
import { useAccount } from "wagmi";

const token = primordiumContracts.token.address;

export default function WithdrawTabContent() {
  const { address, isConnected } = useAccount();
  const { value: mushiBalance } = useFormattedBalance({ address, token });

  const { onOpen } = useContext(ChooseWalletModalContext);

  const [withdrawValue, setWithdrawValue] = useState("");
  return isConnected ? (
    <>
      <p className="mb-2 text-sm text-default-400">
        <span className="text-warning-300">NOTE:</span> Withdrawing burns your MUSHI share tokens.
        Only proceed if you wish to dissolve some or all of your membership:
      </p>
      <AssetAmountInput
        value={withdrawValue}
        onValueChange={setWithdrawValue}
        label="Mint amount"
        token={token}
      />
      <Button color="secondary" size="lg" fullWidth>
        {"Withdraw shares"}
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
