import { Inter, Londrina_Shadow, Londrina_Solid, Roboto_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

export const londrina_solid = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina-solid",
  preload: true,
});

export const londrina_shadow = Londrina_Shadow({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina-shadow",
  preload: true,
});

export const roboto_mono = Roboto_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  preload: true,
  display: "block",
  style: ['normal', 'italic'],
});