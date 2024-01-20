import { Address } from "viem";

const primordiumContracts: {
  [contractName: string]: {
    address: Address
  }
} = {
  token: {
    address: process.env.NEXT_PUBLIC_PRIMORDIUM_TOKEN_ADDRESS as Address
  }
}

export default primordiumContracts;