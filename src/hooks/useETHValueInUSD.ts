"use client";

import { toJSON, fromJSON } from "@/utils/JSONBigInt";
import { useQuery } from "@tanstack/react-query";
import { format, multiply } from "dnum";
import { useEffect, useState } from "react";

const COINGECKO_ETHEREUM_PRICE_LOCAL_STORAGE = "coingecko_ethereum_price";

interface ETHPriceCache {
  ethPriceInUSD: number;
  lastFetchedAt: number;
}

const getETHPriceInUSD = (): Promise<number | undefined> => {
  return fetch(
    "https://api.coingecko.com/api/v3/coins/ethereum?localization=en&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
    { headers: { Accept: "application/json" } },
  )
    .then((res) => {
      return res.json().then((data) => [res, data]);
    })
    .then(([res, data]) => {
      if (!res.ok) {
        throw data;
      }
      return data?.market_data?.current_price?.usd;
    });
};

/**
 * Takes the ETH value as a BigInt, and converts to a string value of USD
 * @param ethValue A BigInt value representing the ETH in wei
 * @returns A formatted string showing the ETH value in USD (or undefined if not yet retrieved)
 */
export default function useETHValueInUSD(ethValue: bigint): string | undefined {
  const [enabled, setEnabled] = useState(false);

  const [ethPriceInUSD, setETHPriceInUSD] = useState<number | undefined>(undefined);
  const [ethValueInUSDFormatted, setETHValueInUSDFormatted] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const cached = window.localStorage.getItem(COINGECKO_ETHEREUM_PRICE_LOCAL_STORAGE);
    if (!cached) {
      setEnabled(true);
    } else {
      let { ethPriceInUSD: price, lastFetchedAt } = fromJSON<ETHPriceCache>(cached);
      // If data is less than 2 minutes old, use cache, otherwise refetch
      if (lastFetchedAt > Date.now() - 2 * 60 * 1000) {
        setETHPriceInUSD(price);
      } else {
        setEnabled(true);
      }
    }
  }, []);

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ["getETHPriceInUSD"],
    queryFn: getETHPriceInUSD,
    enabled,
  });
  useEffect(() => {
    if (data) {
      // Set local cache
      window.localStorage.setItem(
        COINGECKO_ETHEREUM_PRICE_LOCAL_STORAGE,
        toJSON<ETHPriceCache>({ ethPriceInUSD: data, lastFetchedAt: dataUpdatedAt }),
      );
      // Update state
      setETHPriceInUSD(data);
    }
  }, [data, dataUpdatedAt]);

  useEffect(() => {
    if (ethPriceInUSD) {
      setETHValueInUSDFormatted(
        format(multiply([BigInt(Math.floor(ethPriceInUSD * 100)), 2], [ethValue, 18]), 2),
      );
    }
  }, [ethValue, ethPriceInUSD]);

  return ethValueInUSDFormatted;
}
