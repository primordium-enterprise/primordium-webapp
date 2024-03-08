import { defaultChain } from "@/config/wagmi-config";
import { Abi, Address } from "viem";
import { sepolia } from "viem/chains";

const etherscanApiBaseUrl = `https://api${defaultChain.id === sepolia.id ? "-sepolia" : ""}.etherscan.io/api`;

interface EtherscanContractSourceCodeReturn {
  status: string;
  message: string;
  result: EtherscanContractSourceCodeResult[];
}

interface EtherscanContractSourceCodeResult {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  Library: string;
  LicenseType: string;
  Proxy: "0" | "1" | string;
  Implementation: Address | "";
  SwarmSource: string;
}

interface GetEtherscanContractReturn extends EtherscanContractSourceCodeResult {
  parsedAbi?: Abi;
}

function appendAbi(
  contract: GetEtherscanContractReturn,
  appendFromContract: EtherscanContractSourceCodeResult,
) {
  // Only can append if the source code is present and the ABI is a JSON array
  if (
    appendFromContract.SourceCode &&
    appendFromContract.ABI.startsWith("[") &&
    appendFromContract.ABI.endsWith("]")
  ) {
    const parsedAbi = JSON.parse(appendFromContract.ABI);

    // If the contract already has an ABI, append the new ABI, otherise set to this ABI
    contract.parsedAbi =
      !!contract.parsedAbi && contract.parsedAbi.length > 0
        ? [...contract.parsedAbi, ...parsedAbi]
        : parsedAbi;
  }

  return contract;
}

export function getEtherscanContract(
  contractAddress: Address,
  skipImplementationAbi?: boolean,
): Promise<GetEtherscanContractReturn> {
  return fetch(
    `${etherscanApiBaseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
  )
    .then((res) => res.json() as Promise<EtherscanContractSourceCodeReturn>)
    .then(async (data) => {
      if (data.status !== "1") {
        throw new Error(data.message);
      }

      // Unpack the result
      const {
        result: [baseContract],
      } = data;

      const contract = appendAbi(baseContract, baseContract);

      // If the contract is a proxy and we want to include the implementation ABI, fetch it recursively
      if (contract.Proxy === "1" && !skipImplementationAbi && contract.Implementation) {
        const implementationContract = await getEtherscanContract(contract.Implementation);
        contract.ContractName = `${contract.ContractName} -> ${implementationContract.ContractName}`;
        appendAbi(contract, implementationContract);
      }

      return contract;
    });
}
