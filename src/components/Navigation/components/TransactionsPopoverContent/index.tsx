"use client";

import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import { Card, CardBody, Link } from "@nextui-org/react";
import { useContext, useMemo } from "react";
import { sepolia } from "viem/chains";
import { useChainId } from "wagmi";

export default function TransactionsPopoverContent() {
  const chainId = useChainId();
  const { transactions, removeTransaction } = useContext(LocalTransactionsContext);

  return (
    <div className="px-2 py-4">
      {transactions.length > 0 ? (
        transactions.map((tx) => {
          return (
            <Card className="mt-2" key={tx.hash}>
              <CardBody>
                <div className="flex justify-between">
                  <h6 className={`${tx.receipt ? "text-success-300" : "text-warning-300"}`}>
                    {tx.receipt ? "Completed" : "Pending"}
                  </h6>
                  <div className="text-xs ml-4">
                    <Link
                      isExternal
                      showAnchorIcon
                      href={`https://${chainId == sepolia.id ? "sepolia." : ""}etherscan.io/tx/${tx.hash}`}
                    >
                      View on etherscan
                    </Link>
                  </div>
                </div>
                <div>{tx.description}</div>
              </CardBody>
            </Card>
          );
        })
      ) : (
        <p>You have no transactions to view.</p>
      )}
    </div>
  );
}
