import { Abi, Address } from "viem";
import PrimordiumTokenV1Abi from "../abi/PrimordiumTokenV1.abi";
import PrimordiumSharesOnboarderV1Abi from "@/abi/PrimordiumSharesOnboarderV1.abi";

const primordiumContracts: {
  [contractName: string]: {
    address: Address,
    abi: Abi
  }
} = {
  token: {
    address: process.env.NEXT_PUBLIC_PRIMORDIUM_TOKEN_ADDRESS as Address,
    abi: PrimordiumTokenV1Abi
  },
  sharesOnboarder: {
    address: process.env.NEXT_PUBLIC_PRIMORDIUM_SHARES_ONBOARDER_ADDRESS as Address,
    abi: PrimordiumSharesOnboarderV1Abi
  },
  executor: {
    address: process.env.NEXT_PUBLIC_PRIMORDIUM_EXECUTOR_ADDRESS as Address,
    abi: [],
  },
  governor: {
    address: process.env.NEXT_PUBLIC_PRIMORDIUM_GOVERNOR_ADDRESS as Address,
    abi: [],
  }
}

export default primordiumContracts;