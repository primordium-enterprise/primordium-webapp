'use client'

import { WagmiProvider } from "wagmi";
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, foundry } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_MAINNET),
    [sepolia.id]: http(),
    [foundry.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_LOCAL)
  },
});

export const queryClient = new QueryClient();

export default function AppWagmiProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}