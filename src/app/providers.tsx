"use client";

import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ModalManagerProvider from "@/components/_modals/ModalManagerProvider";
import { Client, Provider as URQLProvider, cacheExchange, fetchExchange } from "urql";
import chainConfig from "@/config/chainConfig";
import LocalTransactionsProvider from "@/providers/LocalTransactionsProvider";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import wagmiConfig from "@/config/wagmi-config";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

export const urqlClient = new Client({
  url: chainConfig.subgraphUrl || "",
  exchanges: [cacheExchange, fetchExchange],
});

export default function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: string | null;
}) {
  const router = useRouter();

  return (
    <WagmiProvider config={wagmiConfig} initialState={cookieToInitialState(wagmiConfig, cookie)}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <URQLProvider value={urqlClient}>
            <NextUIProvider navigate={router.push}>
              <LocalTransactionsProvider>
                <ModalManagerProvider>{children}</ModalManagerProvider>
              </LocalTransactionsProvider>
            </NextUIProvider>
          </URQLProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
