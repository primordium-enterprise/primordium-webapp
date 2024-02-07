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
import {primordiumAddresses} from "@/config/addresses";
import { ADDRESS_ZERO } from "@/utils/constants";

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
    address?: Address | undefined;
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
    symbol: isERC20Token ? token == primordiumAddresses[chainId].token ? "MUSHI" : "(ERC20)" : "ETH",
  };

  if (isERC20Token) {
    const contractData = {
      address: token,
      abi: erc20Abi,
    };

    const result = useReadContracts({
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
    });

    const { data } = result;
    balanceData.value = data?.[0].result || balanceData.value;
    balanceData.decimals = (typeof data?.[1].result == 'number' && data?.[1].result) || balanceData.decimals;
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
