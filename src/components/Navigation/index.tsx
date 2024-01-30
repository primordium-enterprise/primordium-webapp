"use client";

import Image from "next/image";
import logo from "public/img/logo-white.png";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useAccount,useDisconnect } from "wagmi";
import DisplayAddress from "../DisplayAddress";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

export default function Navigation() {
  const { open } = useWeb3Modal();
  const { open: isWeb3ModalOpen } = useWeb3ModalState();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { formatted: ethBalance, result: { isSuccess: isEthBalanceSuccess } } = useFormattedBalance({ address });

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/">
        <Image className="pixelated w-12" src={logo} alt="Primordium logo." unoptimized priority />
      </Link>
      <div>
        {isConnected ? (
          <>
            <Dropdown onOpenChange={(isOpen) => setDropdownIsOpen(isOpen)}>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  startContent={
                    isEthBalanceSuccess && <span className="hidden sm:block">{ethBalance} ETH</span>
                  }
                  endContent={dropdownIsOpen ? <CaretUpIcon /> : <CaretDownIcon />}
                >
                  <DisplayAddress address={address} className="font-bold" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Account Actions">
                <DropdownItem onPress={() => open({ view: "Networks" })}>Switch Network</DropdownItem>
                <DropdownItem onPress={() => open()}>Switch Wallet</DropdownItem>
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
              isLoading={isWeb3ModalOpen}
              onPress={() => open()}
            >
              Connect Wallet
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
