'use client'

import { Button } from "@nextui-org/react";
import Image from "next/image";
import walletConnectLogo from "public/wallet-brand-assets/walletconnect-logo.svg";
import braveLogo from "public/wallet-brand-assets/brave.svg";
import { Config, Connector, CreateConnectorFn, UseConnectReturnType } from "wagmi";

const logo = (walletType: string) => {
  switch (walletType) {
    case "walletConnect":
      return walletConnectLogo;
    case "com.brave.wallet":
      return braveLogo;
    default:
      return "";
  }
};

function isConnector(connector: CreateConnectorFn | Connector | undefined): connector is Connector {
  return connector !== undefined && (connector as Connector).id !== undefined;
}

export default function WalletOption({
  connector,
  currentConnector,
  useConnectReturn
}: {
  connector: Connector,
  currentConnector: Connector | undefined,
  useConnectReturn: UseConnectReturnType<Config, unknown>
}) {
  const { connect, variables, isPending, isSuccess } = useConnectReturn;

  const icon = logo(connector.id) || connector.icon;

  const isLastSelected = isConnector(variables?.connector) && variables.connector.id == connector.id;

  const isConnecting = isLastSelected && isPending;
  const isConnected = connector.id == currentConnector?.id;

  return (
    <Button
      className="flex justify-start content-center"
      variant="flat"
      color={isConnected ? 'success' : 'default'}
      isLoading={isConnecting}
      spinnerPlacement="end"
      isDisabled={isPending || isConnected}
      onPress={() => connect({ connector })}
      startContent={icon && <Image
        className="w-6"
        src={icon}
        alt="Wallet icon"
        width="64"
        height="64"
      />}
    >
      {connector.name}
    </Button>
  )
}