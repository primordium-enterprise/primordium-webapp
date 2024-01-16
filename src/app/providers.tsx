'use client'

import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider, State } from "wagmi";
import wagmiConfig from "@/config/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export default function Providers({
  children,
  initialState
}: {
  children: React.ReactNode,
  initialState: State | undefined
}) {
  return (
    <NextUIProvider>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}