"use client";

import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider, State } from "wagmi";
import wagmiConfig, { projectId } from "@/config/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import ModalManagerProvider from "@/components/_modals/ModalManagerProvider";
import { Client, Provider as URQLProvider, cacheExchange, fetchExchange } from "urql";
import chainConfig, { defaultChain } from "@/config/chainConfig";
import LocalTransactionsProvider from "@/providers/LocalTransactionsProvider";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

// Initialize the web3 modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: process.env.NODE_ENV === "production",
  defaultChain,
});

export const urqlClient = new Client({
  url: chainConfig.subgraphUrl || "",
  exchanges: [cacheExchange, fetchExchange],
});

export default function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: State | undefined;
}) {
  const router = useRouter();

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <URQLProvider value={urqlClient}>
          <NextUIProvider navigate={router.push}>
            <LocalTransactionsProvider>
              <ModalManagerProvider>{children}</ModalManagerProvider>
            </LocalTransactionsProvider>
          </NextUIProvider>
        </URQLProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
