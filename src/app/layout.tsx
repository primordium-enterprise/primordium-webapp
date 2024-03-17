import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css"
import Providers from "./providers";
import Navigation from "@/components/Navigation";
import { headers } from "next/headers";
import ToastWrapper from "../components/ToastWrapper";
import { inter, londrina_solid, londrina_shadow, roboto_mono } from "./fonts";
import RequireChainIdModal from "@/components/RequireChainIdModal";

export const metadata: Metadata = {
  title: "PrimordiumDAO",
  description: "Front-end app interface for the Primordium DAO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${londrina_shadow.variable} ${roboto_mono.variable} ${londrina_solid.variable} bg-background text-foreground dark`}
    >
      <body className="min-h-screen bg-background font-roboto-mono text-foreground dark">
        <Providers cookie={headers().get("cookie")}>
            <RequireChainIdModal />
            <Navigation />
            <div className="mx-auto sm:container !max-w-screen-md p-2">
              {children}
            </div>
          <ToastWrapper />
        </Providers>
      </body>
    </html>
  );
}
