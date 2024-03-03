import { Address } from "viem";
import { foundry, sepolia } from "viem/chains";

type PrimordiumContractNames = {
  readonly "token": string;
  readonly "sharesOnboarder": string;
  readonly "executor": string;
  readonly "governor": string;
  readonly "distributor": string;
}

export const chainConfig: {
  [chainId: number]: {
    addresses: {
      [ContractName in keyof PrimordiumContractNames]: Address
    },
    subgraphUrl: string
  }
} = {
  [sepolia.id]: {
    addresses: {
      executor: "0x0435C23ad382D767b9F85B5eE3150B9Cd442e501",
      token: "0xfF2aDC770B46651c5F036aA96deeCEDF9e613901",
      sharesOnboarder: "0xcf0b78E6bB138Aaa6ba2d029D20F639d0EA3a66d",
      governor: "0x029b600067080278c32F4643C1eB8f2b508A9255",
      distributor: "0xC5b8Fa3C998eBE375690A181f52B20b48B3C83eF",
    },
    subgraphUrl: process.env.NEXT_PUBLIC_SUBGRAPH_URL || ""
  },
  [foundry.id]: {
    addresses: {
      executor: "0x6cCf924d8Ab61c1Cf375D00220a09582603D38D6",
      token: "0x472236e3e5bE03bEcde08AD5aaaab5EF9Ec38FA9",
      sharesOnboarder: "0x849b8d8899c3105f9c86946e194268f879A66CE4",
      governor: "0xA98896A921E66983292201a6629FA9D93eF0F3C2",
      distributor: "0x217A246eac5FCDb09570Af269b40ba006dc11a24",
    },
    subgraphUrl: "http://localhost:8000/subgraphs/name/primordium-dao"
  },
}