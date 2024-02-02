import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navigation from "@/components/Navigation";
import { cookieToInitialState } from "wagmi";
import wagmiConfig from "@/config/wagmi-config";
import { headers } from "next/headers";
import ToastWrapper from "../components/ToastWrapper";
import { inter, londrina_solid, londrina_shadow, roboto_mono } from "./fonts";
import RequireChainIdModal from "@/components/RequireChainIdModal";

export const metadata: Metadata = {
  title: "PrimordiumDAO",
  description: "Front-end app interface for the Primordium DAO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Load wagmi state from cookie for SSR rendering
  let initialState = undefined;
  try {
    initialState = cookieToInitialState(wagmiConfig, headers().get("cookie"));
  } catch {}

  return (
    <html
      lang="en"
      className={`${inter.variable} ${londrina_shadow.variable} ${roboto_mono.variable} ${londrina_solid.variable} bg-background text-foreground dark`}
    >
      <body className="min-h-screen bg-background font-roboto-mono text-foreground dark">
        <Providers initialState={initialState}>
            <RequireChainIdModal />
            <Navigation />
            {children}
          <ToastWrapper />
        </Providers>
      </body>
    </html>
  );
}
