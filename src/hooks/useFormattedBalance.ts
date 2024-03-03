import { Address, erc20Abi, pad } from "viem";
import {
  UseBalanceReturnType,
  UseReadContractsReturnType,
  useAccount,
  useBalance,
  useChainId,
  useReadContracts,
} from "wagmi";
import { format } from "dnum";
import abbreviateBalance from "@/utils/abbreviateBalance";
import {chainConfig} from "@/config/chainConfig";
import { ADDRESS_ZERO } from "@/utils/constants";

type BalanceData = {
  value: bigint;
  decimals: number;
  formatted: string;
  symbol: string;
};

export interface UseFormattedBalanceReturnType<Addr> extends BalanceData {
  queryResult: Addr extends Address ? UseReadContractsReturnType : UseBalanceReturnType;
}

export default function useFormattedBalance<TokenAddress extends Address | undefined>(
  params: {
    address?: Address;
    token?: TokenAddress;
  } = {},
): UseFormattedBalanceReturnType<TokenAddress> {
  let { token, address } = params;
  const chainId = useChainId();

  const isERC20Token = token && token !== ADDRESS_ZERO;

  let balanceData: BalanceData = {
    value: BigInt(0),
    decimals: 18,
    formatted: "0",
    symbol: isERC20Token ? token == chainConfig[chainId]?.addresses.token ? "MUSHI" : "(ERC20)" : "ETH",
  };

    const contractData = {
      address: token,
      abi: erc20Abi,
    };

    const erc20Result = useReadContracts({
      contracts: [
        {
          ...contractData,
          functionName: "balanceOf",
          args: [address || ADDRESS_ZERO],
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
      query: {
        enabled: isERC20Token
      }
    });

    const nativeResult = useBalance({ address });

    let queryResult;
    if (isERC20Token) {
      queryResult = erc20Result;
      const { data } = queryResult;
      balanceData.value = data?.[0].result || balanceData.value;
      balanceData.decimals = (typeof data?.[1].result == 'number' && data?.[1].result) || balanceData.decimals;
      balanceData.symbol = data?.[2].result || balanceData.symbol;
      balanceData.formatted = abbreviateBalance(balanceData.value, balanceData.decimals);
    } else {
      queryResult = nativeResult;
      const { data } = queryResult;
      balanceData.value = data?.value || balanceData.value;
      balanceData.decimals = data?.decimals || balanceData.decimals;
      balanceData.formatted = abbreviateBalance(balanceData.value, balanceData.decimals);
    }

    return {
      ...balanceData,
      queryResult,
    } as UseFormattedBalanceReturnType<TokenAddress>;
}
