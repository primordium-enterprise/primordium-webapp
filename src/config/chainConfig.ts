import { Address, Chain } from "viem";
import { foundry, mainnet, sepolia } from "viem/chains";

type PrimordiumContractNames = {
  readonly "token": string;
  readonly "sharesOnboarder": string;
  readonly "executor": string;
  readonly "governor": string;
  readonly "distributor": string;
}

const envChain = process.env.NEXT_PUBLIC_CHAIN;
export const defaultChain: Chain =
  envChain === "mainnet"
    ? mainnet
    : envChain === "sepolia"
      ? sepolia
      : process.env.NODE_ENV === "development"
        ? foundry
        : mainnet;

interface ChainConfig {
  addresses: {
    [ContractName in keyof PrimordiumContractNames]: Address
  },
  subgraphUrl: string
}

export const chainConfigs: {
  [chainId: number]: ChainConfig
} = {
  [mainnet.id]: {
    addresses: {
      executor: "0x6337b8630a3C641BEB0b7c26Fa542e31d6215c64",
      token: "0x2aADC4ab6F8679C86f453a0FCc8B6B10d872335D",
      sharesOnboarder: "0xAf504e6811F0785eb0da73E5B252885cDE301d3C",
      governor: "0xc384cb3bc23CB99826405b91c2E285e92E293Db8",
      distributor: "0x540d08e2061ba64bB32B53C3D591faD841105c20",
    },
    subgraphUrl: process.env.NEXT_PUBLIC_SUBGRAPH_URL_MAINNET || "",
  },
  [sepolia.id]: {
    addresses: {
      executor: "0x0435C23ad382D767b9F85B5eE3150B9Cd442e501",
      token: "0xfF2aDC770B46651c5F036aA96deeCEDF9e613901",
      sharesOnboarder: "0xcf0b78E6bB138Aaa6ba2d029D20F639d0EA3a66d",
      governor: "0x029b600067080278c32F4643C1eB8f2b508A9255",
      distributor: "0xC5b8Fa3C998eBE375690A181f52B20b48B3C83eF",
    },
    subgraphUrl: process.env.NEXT_PUBLIC_SUBGRAPH_URL_SEPOLIA || ""
  },
  [foundry.id]: {
    addresses: {
      executor: "0x6cCf924d8Ab61c1Cf375D00220a09582603D38D6",
      token: "0x472236e3e5bE03bEcde08AD5aaaab5EF9Ec38FA9",
      sharesOnboarder: "0x849b8d8899c3105f9c86946e194268f879A66CE4",
      governor: "0x02445fD52Cf3C6baAd9D616E89233DA9A819aa10",
      distributor: "0x217A246eac5FCDb09570Af269b40ba006dc11a24",
    },
    subgraphUrl: "http://localhost:8000/subgraphs/name/primordium-dao"
  },
}

const chainConfig: ChainConfig = chainConfigs[defaultChain.id];

export default chainConfig;