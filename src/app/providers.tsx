'use client'

import { NextUIProvider } from "@nextui-org/react";
import AppWagmiProvider from "../providers/wagmi-provider";

export default function Providers({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <NextUIProvider>
      <AppWagmiProvider>
        {children}
      </AppWagmiProvider>
    </NextUIProvider>
  );
}