'use client'

import { ConnectWalletModalContext } from "@/modals/ConnectWalletModal";
import { Button } from "@nextui-org/react";
import { useContext } from "react";

export default function Navigation() {
  const connectWalletModal = useContext(ConnectWalletModalContext);

  return (
    <nav className="flex justify-end content-center px-2 py-4">
      <Button color="primary" onClick={connectWalletModal.onOpen}>Connect Wallet</Button>
    </nav>
  );
}