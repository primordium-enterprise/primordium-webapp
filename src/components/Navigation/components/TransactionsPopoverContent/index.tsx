"use client";

import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import { useContext } from "react";

export default function TransactionsPopoverContent() {
  const { transactions, removeTransaction } = useContext(LocalTransactionsContext);

  return (
    <div className="px-2 py-4">
      {transactions.length > 0 ? (
        transactions.map((tx) => {
          return <p key={tx.hash}>{tx.hash}</p>
        })
      ) : (
        <p>You have no transactions to view.</p>
      )}
    </div>
  );
}
