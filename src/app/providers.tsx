"use client";

import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider, State } from "wagmi";
import wagmiConfig from "@/config/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChooseWalletModal from "@/context/ChooseWalletModal";
import { useRouter } from "next/navigation";

export const queryClient = new QueryClient();

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
          <ChooseWalletModal>
            {children}
          </ChooseWalletModal>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
