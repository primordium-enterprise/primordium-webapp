"use client";

import Image from "next/image";
import logo from "public/logo-white.png";
import { ChooseWalletModalContext } from "@/modals/ChooseWalletModal";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { serialize, useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import DisplayAddress from "../DisplayAddress";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { formatEther, formatUnits } from "viem";
import { abbreviateETHBalance } from "@/utils/abbreviateETHBalance";
import Link from "next/link";

export default function Navigation() {
  const ChooseWalletModal = useContext(ChooseWalletModalContext);

  const { address, connector, isConnected, isConnecting, status } = useAccount();
  const { data: balanceData } = useBalance({ address: address });
  const { disconnect } = useDisconnect();

  const [formattedBalance, setFormattedBalance] = useState("");
  useEffect(() => {
    if (balanceData === undefined) {
      setFormattedBalance("");
    } else {
      setFormattedBalance(
        abbreviateETHBalance(formatUnits(balanceData.value, balanceData.decimals)).concat(
          " ",
          balanceData.symbol,
        ),
      );
    }
  }, [balanceData]);

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="https://primordiumdao.xyz" target="_blank">
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
                    formattedBalance && <span className="hidden sm:block">{formattedBalance}</span>
                  }
                  endContent={dropdownIsOpen ? <CaretUpIcon /> : <CaretDownIcon />}
                >
                  <DisplayAddress address={address} className="font-bold" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Account Actions">
                <DropdownItem onPress={ChooseWalletModal.onOpen}>Switch Wallet</DropdownItem>
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
      </div>
    </nav>
  );
}
