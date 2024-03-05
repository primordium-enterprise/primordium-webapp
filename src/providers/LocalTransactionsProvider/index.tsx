"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { DBSchema, IDBPDatabase, openDB } from "idb";
import { useAccount, useConfig } from "wagmi";
import { Address, TransactionReceipt, WaitForTransactionReceiptReturnType } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";

export const LocalTransactionsContext = createContext({});

interface StoredTx {
  hash: `0x${string}`;
  type: string;
  account: Address;
  receipt: TransactionReceipt | null;
  createdAt: number;
}

interface LocalTransactionsDB extends DBSchema {
  transactions: {
    key: string;
    value: StoredTx;
    indexes: {
      account: Address;
    };
  };
}

interface StateTx extends StoredTx {
  waitForReceipt?: Promise<WaitForTransactionReceiptReturnType>;
}

export default function LocalTransactionsProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<IDBPDatabase<LocalTransactionsDB> | undefined>(undefined);
  const { address } = useAccount();
  const config = useConfig();

  const [transactions, setTransactions] = useState<StateTx[]>([]);

  useEffect(() => {
    openDB<LocalTransactionsDB>("LocalTransactions", 1, {
      upgrade: (db) => {
        const transactionsStore = db.createObjectStore("transactions", {
          keyPath: "hash",
        });
        transactionsStore.createIndex("account", "account", { unique: false });
      },
    })
      .then(setDb)
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (address && db) {
      db.getAllFromIndex("transactions", "account", address).then((txs) => {
        setTransactions(
          txs
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((_tx) => {
              const tx = _tx as StateTx;
              // Create promises in the state transactions to wait for receipt on pending transactions
              if (!tx.receipt) {
                tx.waitForReceipt = waitForTransactionReceipt(config, { hash: tx.hash }).then(
                  (receipt) => {
                    // On receipt, update the tx in the state
                    setTransactions((currentTxs) => {
                      let i = currentTxs.findIndex((a) => a.hash === receipt.transactionHash);
                      if (i > -1) {
                        currentTxs[i].receipt = receipt;
                      }
                      return [...currentTxs];
                    });
                    // Also update the transaction in the db
                    _tx.receipt = receipt;
                    db.put("transactions", _tx, _tx.hash);
                  },
                );
              }
              return tx;
            }),
        );
      });
    } else {
      // Reset to empty array
      setTransactions([]);
    }
  }, [address, db, config]);

  const addTransaction = useCallback(
    (hash: `0x${string}`, type: string) => {
      if (db && address) {
        const tx: StoredTx = {
          hash,
          type,
          account: address,
          receipt: null,
          createdAt: Date.now(),
        };

        db.put("transactions", tx, tx.hash);

        setTransactions((currentTxs) => [tx, ...currentTxs]);
      }
    },
    [db, address],
  );

  return (
    <LocalTransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
      }}
    >
      {children}
    </LocalTransactionsContext.Provider>
  );
}
