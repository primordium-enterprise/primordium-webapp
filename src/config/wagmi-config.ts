import { createConfig, http, createStorage, cookieStorage } from "wagmi";
import { Chain, mainnet, sepolia, foundry } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_MAINNET),
  [sepolia.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_SEPOLIA),
  [foundry.id]: http(process.env.NEXT_PUBLIC_JSON_RPC_LOCAL)
}

const chains: [Chain, ...Chain[]] = [mainnet, sepolia];
// local testing
if (process.env.NODE_ENV == 'development') {
  chains.push(foundry);
}

const wagmiConfig = createConfig({
  chains: chains,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  multiInjectedProviderDiscovery: true,
  connectors: [],
  transports: transports
});

export default wagmiConfig;