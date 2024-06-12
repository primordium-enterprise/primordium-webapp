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
import { usePathname } from "next/navigation";
import MushiIcon from "../MushiIcon";
import TransactionsPopoverContent from "./components/TransactionsPopoverContent";
import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import { useAccountModal, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import hrefs from "@/config/hrefs";

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
    title: "Membership Tokens",
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
  const { connectModalOpen, openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();

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
    <nav className="flex items-center justify-between p-2 pb-6 xs:pb-8 sm:p-4 sm:pb-12">
      <Link href="/">
        <Image
          className="pixelated w-8 xs:w-12"
          src={logo}
          alt="Primordium logo."
          unoptimized
          priority
        />
      </Link>
      <div className="flex h-8 xs:h-10">
        {isConnected ? (
          <>
            <Dropdown onOpenChange={(isOpen) => setAccountDropdownIsOpen(isOpen)} backdrop="blur">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="h-full px-3 text-xs xs:px-4 xs:text-base"
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
                <DropdownItem onPress={() => openChainModal && openChainModal()}>
                  Switch Network
                </DropdownItem>
                <DropdownItem onPress={() => openAccountModal && openAccountModal()}>
                  View Account
                </DropdownItem>
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
                content: "p-0",
              }}
            >
              <Badge
                content={pendingTransactionsCount}
                color="warning"
                isInvisible={pendingTransactionsCount === 0}
              >
                <PopoverTrigger>
                  <Button variant="solid" className="ml-2 h-full min-w-0 px-3 xs:px-4">
                    <PaperPlaneIcon className="h-[1em] w-[1em]" />
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
              className="h-full px-3 text-xs xs:px-4 xs:text-base"
              isLoading={connectModalOpen}
              onPress={() => openConnectModal && openConnectModal()}
            >
              Connect Wallet
            </Button>
          </>
        )}

        <Dropdown
          isOpen={menuDropdownIsOpen}
          onOpenChange={(isOpen) => setMenuDropdownIsOpen(isOpen)}
          backdrop="blur"
        >
          <DropdownTrigger>
            <Button variant="solid" className="ml-2 h-full min-w-0 px-3 xs:px-4">
              <HamburgerMenuIcon className="h-[1em] w-[1em]" />
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
                href={hrefs.whitepaper}
                target="_blank"
                startContent={<ReaderIcon />}
              >
                Whitepaper
              </DropdownItem>
              <DropdownItem
                href={hrefs.github_contracts}
                target="_blank"
                startContent={<GitHubLogoIcon />}
              >
                GitHub
              </DropdownItem>
              <DropdownItem
                href={hrefs.discord}
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
