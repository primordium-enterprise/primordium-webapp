'use client'

import { ConnectWalletModalContext } from "@/modals/ConnectWalletModal";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useContext } from "react";
import { serialize, useAccount, useConnect, useDisconnect } from "wagmi";

export default function Navigation() {
  const connectWalletModal = useContext(ConnectWalletModalContext);

  const { address, connector, isConnected, isConnecting, status } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <nav className="flex justify-end content-center px-2 py-4">
      {isConnected ? <>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">{address}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Account Actions">
            <DropdownItem
              key="disconnect"
              className="text-danger"
              color="danger"
              onClick={() => disconnect()}
            >
              Disconnect
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </> : <>
        <Button variant="ghost" color="default" isLoading={isConnecting} onClick={connectWalletModal.onOpen}>Connect Wallet</Button>
      </>}
    </nav>
  );
}