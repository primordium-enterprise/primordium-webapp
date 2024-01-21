import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  parseCookie,
  CreateConnectorFn,
  Config,
  State,
  deserialize,
  serialize,
} from "wagmi";
import { Chain, mainnet, sepolia, foundry } from "wagmi/chains";
import { injected, safe, walletConnect, coinbaseWallet } from "wagmi/connectors";

const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_MAINNET),
  [sepolia.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_SEPOLIA),
  [foundry.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_LOCAL),
};

const chains: [Chain, ...Chain[]] = [mainnet, sepolia];
// local testing
if (process.env.NODE_ENV == "development") {
  chains.push(foundry);
}

const connectors: CreateConnectorFn[] = [
  // safe(),
  coinbaseWallet({
    appName: "Primordium DAO"
  }),
  walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "" })
];

const wagmiConfig = createConfig({
  chains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  multiInjectedProviderDiscovery: true,
  connectors,
  transports,
});

export default wagmiConfig;
