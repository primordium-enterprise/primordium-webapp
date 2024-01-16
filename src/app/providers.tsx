'use client'

import { NextUIProvider } from "@nextui-org/react";
import AppWagmiProvider from "../providers/wagmi-provider";
import { State } from "wagmi";

export default function Providers({
  children,
  initialState
}: {
  children: React.ReactNode,
  initialState: State | undefined
}) {
  return (
    <NextUIProvider>
      <AppWagmiProvider initialState={initialState}>
        {children}
      </AppWagmiProvider>
    </NextUIProvider>
  );
}