import { http, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia, foundry } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defaultChain } from "./chainConfig";

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
if (!projectId) {
  throw new Error(
    "Missing wallet connect project ID from env as 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'",
  );
}

const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_MAINNET),
  [sepolia.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_SEPOLIA),
  [foundry.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_LOCAL),
};

const wagmiConfig = getDefaultConfig({
  appName: "PrimordiumDAO",
  appDescription: "The application interface for joining and governing PrimordiumDAO.",
  appUrl: "https://app.primordiumdao.xyz",
  appIcon: "https://avatars.githubusercontent.com/u/128849842",
  chains: [defaultChain],
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
});

export default wagmiConfig;
