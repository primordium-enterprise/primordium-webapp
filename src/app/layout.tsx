import type { Metadata } from "next";
import { Inter, Londrina_Shadow } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navigation from "@/components/Navigation";
import { cookieToInitialState } from "wagmi";
import wagmiConfig from "@/config/wagmi-config";
import { headers } from "next/headers";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const londrina_shadow = Londrina_Shadow({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina-shadow",
});

export const metadata: Metadata = {
  title: "Primordium DAO App",
  description: "Front-end app interface for the Primordium DAO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Load wagmi state from cookie for SSR rendering
  let initialState = undefined;
  try {
    initialState = cookieToInitialState(wagmiConfig, headers().get("cookie"));
  } catch {}

  return (
    <html lang="en" className={`${inter.variable} ${londrina_shadow.variable}`}>
      <body className={`${inter.className} dark text-foreground bg-background min-h-screen`}>
        <Providers initialState={initialState}>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
