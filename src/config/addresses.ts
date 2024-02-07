import { Abi, Address } from "viem";
import PrimordiumTokenV1Abi from "../abi/PrimordiumTokenV1.abi";
import PrimordiumSharesOnboarderV1Abi from "@/abi/PrimordiumSharesOnboarderV1.abi";
import wagmiConfig, { defaultChain } from "./wagmi-config";
import { foundry, sepolia } from "viem/chains";

type PrimordiumContractNames = {
  readonly "token": string;
  readonly "sharesOnboarder": string;
  readonly "executor": string;
  readonly "governor": string;
  readonly "distributor": string;
}

export const primordiumAddresses: {
  [chainId: number]: {
    [ContractName in keyof PrimordiumContractNames]: Address
  }
} = {
  [sepolia.id]: {
    executor: "0x0435C23ad382D767b9F85B5eE3150B9Cd442e501",
    token: "0xfF2aDC770B46651c5F036aA96deeCEDF9e613901",
    sharesOnboarder: "0xcf0b78E6bB138Aaa6ba2d029D20F639d0EA3a66d",
    governor: "0x029b600067080278c32F4643C1eB8f2b508A9255",
    distributor: "0xC5b8Fa3C998eBE375690A181f52B20b48B3C83eF",
  },
  [foundry.id]: {
    executor: "0xF3e74DE49Fbb516fB19fa2BfcD5c71B99D7204c9",
    token: "0x99b5819e596F43Bbd73b2612F2cD207ACEA23480",
    sharesOnboarder: "0x694a751C9900a0897e23ab7BeA7da27dd15bddA4",
    governor: "0x0946A2cD2183C445E39D3df61723b201D9d3CAa0",
    distributor: "0x33927f51AB904fC15b831B7A1339D931DAF9bfA4",
  },
}