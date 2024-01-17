"use client";

import { ChooseWalletModalContext } from "@/modals/ChooseWalletModal";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useContext, useState } from "react";
import { serialize, useAccount, useConnect, useDisconnect } from "wagmi";
import DisplayAddress from "../DisplayAddress";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

export default function Navigation() {
  const ChooseWalletModal = useContext(ChooseWalletModalContext);

  const { address, connector, isConnected, isConnecting, status } = useAccount();
  const { disconnect } = useDisconnect();

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  return (
    <nav className="flex justify-end content-center px-2 py-4">
      {isConnected ? (
        <>
          <Dropdown onOpenChange={(isOpen) => setDropdownIsOpen(isOpen)}>
            <DropdownTrigger>
              <Button variant="bordered">
                <DisplayAddress address={address} />
                {dropdownIsOpen ? <CaretUpIcon /> : <CaretDownIcon />}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Account Actions">
              <DropdownItem
                key="disconnect"
                className="text-danger"
                color="danger"
                onPress={() => disconnect()}
              >
                Disconnect
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            color="default"
            // isLoading={isConnecting}
            onPress={ChooseWalletModal.onOpen}
          >
            Connect Wallet
          </Button>
        </>
      )}
    </nav>
  );
}
