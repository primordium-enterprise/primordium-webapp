import { Inter, Londrina_Shadow, Roboto_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

export const londrina_shadow = Londrina_Shadow({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina-shadow",
  preload: true,
});

export const roboto_mono = Roboto_Mono({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  preload: true,
  display: "block",
});