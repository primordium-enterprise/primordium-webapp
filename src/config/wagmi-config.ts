import { createConfig, http, createStorage, cookieStorage, CreateConnectorFn } from "wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { Chain, mainnet, sepolia, foundry } from "wagmi/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
if (!projectId) {
  throw new Error(
    "Missing wallet connect project ID from env as 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'",
  );
}

const metadata = {
  name: "PrimordiumDAO",
  description: "Front-end app for PrimordiumDAO",
  url: "https:/app.primordiumdao.xyz", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/128849842"],
};

const chains: [Chain, ...Chain[]] = [mainnet, sepolia];
// local testing
if (process.env.NODE_ENV === "development") {
  chains.unshift(foundry);
}

const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_MAINNET),
  [sepolia.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_SEPOLIA),
  [foundry.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_LOCAL),
};

// const connectors: CreateConnectorFn[] = [
//   coinbaseWallet({
//     appName: "Primordium DAO"
//   }),
//   walletConnect({ projectId })
// ];

// const wagmiConfig = createConfig({
//   chains,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
//   multiInjectedProviderDiscovery: true,
//   connectors,
//   transports,
// });

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
});

export default wagmiConfig;
