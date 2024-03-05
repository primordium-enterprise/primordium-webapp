"use client";

import Image from "next/image";
import logo from "public/img/logo-white.png";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  DropdownSection,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
} from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import DisplayAddress from "../DisplayAddress";
import {
  CaretDownIcon,
  CaretUpIcon,
  DiscordLogoIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  PaperPlaneIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { usePathname } from "next/navigation";
import MushiIcon from "../MushiIcon";
import TransactionsPopoverContent from "./components/TransactionsPopoverContent";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";

const routes: {
  route: string;
  title: string;
}[] = [
  {
    route: "/",
    title: "Home",
  },
  {
    route: "/exchange",
    title: "Exchange",
  },
  {
    route: "/vote",
    title: "Proposals",
  },
];

if (process.env.NODE_ENV === "development") {
  routes.push({ route: "/dev", title: "(dev) Configure Anvil" });
}

export default function Navigation() {
  const pathname = usePathname();
  const { open } = useWeb3Modal();
  const { open: isWeb3ModalOpen } = useWeb3ModalState();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { isTransactionsListOpen, setIsTransactionsListOpen, pendingTransactionsCount } =
    useContext(LocalTransactionsContext);

  const {
    formatted: ethBalance,
    queryResult: { isSuccess: isEthBalanceSuccess },
  } = useFormattedBalance({ address });

  const [accountDropdownIsOpen, setAccountDropdownIsOpen] = useState(false);
  const [menuDropdownIsOpen, setMenuDropdownIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-2 xs:p-2 sm:p-4">
      <Link href="/">
        <Image className="pixelated w-12" src={logo} alt="Primordium logo." unoptimized priority />
      </Link>
      <div className="flex">
        {isConnected ? (
          <>
            <Dropdown onOpenChange={(isOpen) => setAccountDropdownIsOpen(isOpen)} backdrop="blur">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="text-xs xs:text-base"
                  startContent={
                    isEthBalanceSuccess && <span className="hidden sm:block">{ethBalance} ETH</span>
                  }
                  endContent={accountDropdownIsOpen ? <CaretUpIcon /> : <CaretDownIcon />}
                >
                  <DisplayAddress address={address} className="font-bold" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Account Actions"
                itemClasses={{
                  title: "text-xs sm:text-sm",
                }}
              >
                <DropdownItem onPress={() => open({ view: "Networks" })}>
                  Switch Network
                </DropdownItem>
                <DropdownItem onPress={() => open()}>View Account</DropdownItem>
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

            <Popover
              placement="bottom"
              isOpen={isTransactionsListOpen}
              onOpenChange={setIsTransactionsListOpen}
              classNames={{
                content: "p-0"
              }}
            >
              <Badge
                content={pendingTransactionsCount}
                color="warning"
                isInvisible={pendingTransactionsCount === 0}
              >
                <PopoverTrigger>
                  <Button variant="solid" className="ml-2 min-w-0">
                    <PaperPlaneIcon />
                  </Button>
                </PopoverTrigger>
              </Badge>
              <PopoverContent>
                <TransactionsPopoverContent />
              </PopoverContent>
            </Popover>
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

        <Dropdown onOpenChange={(isOpen) => setMenuDropdownIsOpen(isOpen)} backdrop="blur">
          <DropdownTrigger>
            <Button variant="solid" className="ml-2 min-w-0">
              <HamburgerMenuIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Menu"
            itemClasses={{
              title: "text-xs sm:text-sm",
            }}
          >
            <DropdownSection title="Pages" showDivider>
              {routes.map(({ route, title }) => (
                <DropdownItem
                  key={route}
                  href={route}
                  className={route === pathname ? "bg-default-100" : ""}
                >
                  {title}
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection title="Links">
              <DropdownItem
                href="https://primordiumdao.xyz"
                target="_blank"
                startContent={<MushiIcon />}
              >
                Primordium Website
              </DropdownItem>
              <DropdownItem
                href="https://primordiumdao.xyz/whitepaper.pdf"
                target="_blank"
                startContent={<ReaderIcon />}
              >
                Whitepaper
              </DropdownItem>
              <DropdownItem
                href="https://github.com/PrimordiumDAO/primordium-contracts"
                target="_blank"
                startContent={<GitHubLogoIcon />}
              >
                GitHub
              </DropdownItem>
              <DropdownItem
                href="https://discord.gg/H9AyEuggyP"
                target="_blank"
                startContent={<DiscordLogoIcon />}
              >
                Discord
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
}
