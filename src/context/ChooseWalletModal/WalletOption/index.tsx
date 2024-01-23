"use client";

import {
  Config,
  Connector,
  CreateConnectorFn,
  UseAccountReturnType,
  UseConnectReturnType,
  useAccount,
} from "wagmi";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import walletConnectLogo from "public/img/wallet-brand-assets/walletconnect-logo.svg";
import braveLogo from "public/img/wallet-brand-assets/brave.svg";
import safeLogo from "public/img/wallet-brand-assets/safe-logo.svg";
import coinbaseWalletLogo from "public/img/wallet-brand-assets/coinbase-wallet-logo.svg";
import { ConnectErrorType } from "wagmi/actions";
import classNames from "classnames";
import DisplayAddress from "@/components/DisplayAddress";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const logo = (connectorId: string) => {
  switch (connectorId) {
    case "walletConnect":
      return walletConnectLogo;
    case "com.brave.wallet":
      return braveLogo;
    case "coinbaseWalletSDK":
      return coinbaseWalletLogo;
    case "safe":
      return safeLogo;
    default:
      return "";
  }
};

function isConnector(connector: CreateConnectorFn | Connector | undefined): connector is Connector {
  return connector !== undefined && (connector as Connector).id !== undefined;
}

export default function WalletOption({
  connector,
  useConnectReturn,
}: {
  connector: Connector;
  useConnectReturn: UseConnectReturnType<Config, unknown>;
}) {
  const { connector: currentConnector, addresses } = useAccount();
  const { connect, variables, isPending, isSuccess } = useConnectReturn;

  const icon = logo(connector.id) || connector.icon;

  const isLastSelected =
    isConnector(variables?.connector) && variables.connector.id == connector.id;

  const isConnecting = isLastSelected && isPending;
  const isConnected = connector.id === currentConnector?.id;

  return (
    <>
      <Button
        className="flex justify-start items-center data-[disabled=true]:opacity-75"
        variant={isConnected ? "bordered" : "flat"}
        color={isConnected ? "success" : "default"}
        isLoading={isConnecting}
        spinnerPlacement="end"
        isDisabled={isPending || isConnected}
        onPress={() =>
          connect(
            { connector },
            {
              onSettled: (data, error, variables) => {
                // console.log("settled");
                // console.log(data);
                // console.log(error);
                // console.log(variables);
              },
            },
          )
        }
        startContent={
          icon && <Image className="w-6" src={icon} alt="Wallet icon" width="64" height="64" />
        }
      >
        {connector.name}
      </Button>
      {isConnected && addresses && (
        addresses.map(addr => (
          <div key={addr} className="text-sm pl-8 flex items-center">
            <span className="opacity-50">Account:&nbsp;</span>
            <DisplayAddress address={addr} />
          </div>
        ))
      )}
    </>
  );
}
