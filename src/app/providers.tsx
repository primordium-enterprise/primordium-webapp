"use client";

import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider, State, useSwitchChain, useChainId } from "wagmi";
import wagmiConfig, { projectId } from "@/config/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { foundry, mainnet, sepolia } from "viem/chains";
import { useEffect } from "react";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

// Initialize the web3 modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: process.env.NODE_ENV === "production",
});

function InitialChainSelector({ children }: { children: React.ReactNode }) {
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      if (window.location.hostname.includes('app.primordiumdao')) {
        switchChain(mainnet);
      } else {
        switchChain(sepolia);
      }
    } else {
      switchChain(foundry);
    }
  }, []);

  return children;
}

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
        <NextUIProvider navigate={router.push}>
          <InitialChainSelector>
            {children}
          </InitialChainSelector>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
