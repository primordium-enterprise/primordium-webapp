'use client'

import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import wagmiConfig from "@/config/wagmi-config";

export const queryClient = new QueryClient();

export default function AppWagmiProvider({
  children,
  initialState
}: {
  children: React.ReactNode,
  initialState: State | undefined
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}