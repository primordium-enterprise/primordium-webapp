import { Address, erc20Abi } from "viem";
import {
  UseBalanceReturnType,
  UseReadContractsReturnType,
  useAccount,
  useBalance,
  useReadContracts,
} from "wagmi";
import { format } from "dnum";
import abbreviateBalance from "@/utils/abbreviateBalance";

type BalanceData = {
  value: bigint;
  decimals: number;
  formatted: string;
  symbol: string;
};

export interface UseFormattedBalanceReturnType<Addr> extends BalanceData {
  result: Addr extends Address ? UseReadContractsReturnType : UseBalanceReturnType;
}

export default function useFormattedBalance<TokenAddress extends Address | undefined>(
  params: {
    token?: TokenAddress;
    address?: Address;
  } = {},
): UseFormattedBalanceReturnType<TokenAddress> {
  let { token, address } = params;

  if (!address) {
    address = useAccount().address;
  }

  let balanceData: BalanceData = {
    value: BigInt(0),
    decimals: 18,
    formatted: "0",
    symbol: token ? "ERC20" : "ETH",
  };

  if (token && address) {
    const contractData = {
      address: token,
      abi: erc20Abi,
    };

    const result = useReadContracts({
      contracts: [
        {
          ...contractData,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...contractData,
          functionName: "decimals",
        },
        {
          ...contractData,
          functionName: "symbol",
        },
      ],
    });

    const { data } = result;
    balanceData.value = data?.[0].result || balanceData.value;
    balanceData.decimals = data?.[1].result || balanceData.decimals;
    balanceData.symbol = data?.[2].result || balanceData.symbol;
    balanceData.formatted = abbreviateBalance(balanceData.value, balanceData.decimals);

    return {
      ...balanceData,
      result,
    } as UseFormattedBalanceReturnType<TokenAddress>;
  } else {
    const result = useBalance({ address });

    const { data } = result;
    balanceData.value = data?.value || balanceData.value;
    balanceData.decimals = data?.decimals || balanceData.decimals;
    balanceData.formatted = abbreviateBalance(balanceData.value, balanceData.decimals);

    return {
      ...balanceData,
      result,
    } as UseFormattedBalanceReturnType<TokenAddress>;
  }
}
