"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DBSchema, IDBPDatabase, openDB } from "idb";
import { Config, useAccount, useConfig } from "wagmi";
import { Address, TransactionReceipt, WaitForTransactionReceiptReturnType } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { SAFE_CONFIRMATIONS } from "@/utils/constants";

export const LocalTransactionsContext = createContext<{
  transactions: StateTx[];
  pendingTransactionsCount: number;
  isTransactionsListOpen: boolean;
  setIsTransactionsListOpen: Dispatch<SetStateAction<boolean>>;
  addTransaction: (hash: Hash, description: string) => void;
  removeTransaction: (hash: Hash) => void;
}>({
  transactions: [],
  pendingTransactionsCount: 0,
  isTransactionsListOpen: false,
  setIsTransactionsListOpen: ((newState: boolean) => {}) as Dispatch<SetStateAction<boolean>>,
  addTransaction: (hash, description) => {},
  removeTransaction: (hash) => {},
});

type Hash = `0x${string}`;

interface StoredTx {
  hash: Hash;
  description: string;
  account: Address;
  receipt: WaitForTransactionReceiptReturnType | null;
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
  waitForReceiptConfirmation?: Promise<WaitForTransactionReceiptReturnType>;
}

const txReceiptSetStateAction = (receipt: TransactionReceipt): SetStateAction<StateTx[]> => {
  return (currentTxs) => {
    let i = currentTxs.findIndex((a) => a.hash === receipt.transactionHash);
    if (i > -1) {
      currentTxs[i].receipt = receipt;
    }
    return [...currentTxs];
  };
};

export default function LocalTransactionsProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<IDBPDatabase<LocalTransactionsDB> | undefined>(undefined);
  const { address } = useAccount();
  const config = useConfig();

  const [transactions, setTransactions] = useState<StateTx[]>([]);
  const [isTransactionsListOpen, setIsTransactionsListOpen] = useState(false);

  const pendingTransactionsCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (!transactions[i].receipt) {
        count++;
      }
    }
    return count;
  }, [transactions]);

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

  // Initializes promises on StateTx to watch for transaction receipt
  const initWaitForTransactionReceipt = (tx: StateTx, db?: IDBPDatabase<LocalTransactionsDB>) => {
    // On receipt, update in state
    tx.waitForReceipt = waitForTransactionReceipt(config, {
      hash: tx.hash,
      confirmations: process.env.NODE_ENV === "development" ? 3 : 1,
    }).then((receipt) => {
      setTransactions(txReceiptSetStateAction(receipt));
    });
    // After more confirmations, update in state and storage as well (considered finalized)
    if (db) {
      tx.waitForReceiptConfirmation = waitForTransactionReceipt(config, {
        hash: tx.hash,
        confirmations: SAFE_CONFIRMATIONS,
        pollingInterval: 24000,
      }).then((receipt) => {
        setTransactions(txReceiptSetStateAction(receipt));
        let { hash, description, account, createdAt } = tx;
        db.put("transactions", { hash, description, account, createdAt, receipt });
      });
    }
  };

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
                initWaitForTransactionReceipt(tx, db);
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
    (hash: Hash, description: string) => {
      if (db && address) {
        const tx: StoredTx = {
          hash,
          description,
          account: address,
          receipt: null,
          createdAt: Date.now(),
        };

        db.put("transactions", tx).catch(console.log);
        setTransactions((currentTxs) => [tx, ...currentTxs]);
        initWaitForTransactionReceipt(tx, db);
      }
    },
    [db, address],
  );

  const removeTransaction = useCallback(
    (hash: Hash) => {
      setTransactions((currentTxs) => {
        let i = currentTxs.findIndex((tx) => tx.hash === hash);
        if (i > -1) {
          let updatedTxs = [...currentTxs];
          updatedTxs.splice(i, 1);
          return updatedTxs;
        }
        return currentTxs;
      });
      db?.delete("transactions", hash).catch(console.log);
    },
    [db],
  );

  return (
    <LocalTransactionsContext.Provider
      value={{
        transactions,
        pendingTransactionsCount,
        isTransactionsListOpen,
        setIsTransactionsListOpen,
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </LocalTransactionsContext.Provider>
  );
}
