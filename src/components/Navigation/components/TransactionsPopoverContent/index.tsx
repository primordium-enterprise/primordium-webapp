"use client";

import { LocalTransactionsContext } from "@/providers/LocalTransactionsProvider";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useContext, useMemo, useState } from "react";
import { Hash } from "viem";
import { sepolia } from "viem/chains";
import { useChainId } from "wagmi";

export default function TransactionsPopoverContent() {
  const chainId = useChainId();
  const { transactions, removeTransaction } = useContext(LocalTransactionsContext);

  const [confirmDelete, setConfirmDelete] = useState<Hash | undefined>();

  return (
    <div className="max-h-[65vh] w-[400px] max-w-[90vw] overflow-y-auto overscroll-none px-3 py-4">
      {transactions.length > 0 ? (
        <>
          <h2 className="text-foreground-500">Your transactions:</h2>
          {transactions.map((tx) => {
            const isDeleting = tx.hash === confirmDelete;
            return (
              <Card className="mt-2" key={tx.hash}>
                <CardBody>
                  <div className="flex justify-between">
                    <h6
                      className={`xs:text-md text-sm ${tx.receipt ? "text-success-200" : "text-warning-300"}`}
                    >
                      {tx.receipt ? "Completed" : "Pending"}
                    </h6>
                    <div className="2xs:text-2xs ml-4 text-xs xs:text-xs">
                      <Link
                        isExternal
                        showAnchorIcon
                        className=""
                        href={`https://${chainId == sepolia.id ? "sepolia." : ""}etherscan.io/tx/${tx.hash}`}
                      >
                        <span className="2xs:inline hidden">View on etherscan</span>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-foreground-600 xs:text-sm">
                    {tx.description}
                  </div>
                  <div className="flex justify-end">
                    {isDeleting && (
                      <>
                        <Button
                          className="text-2xs mr-2 h-auto min-h-0 w-auto min-w-0 p-1"
                          size="sm"
                          color="danger"
                          isIconOnly
                          onPress={() => removeTransaction(tx.hash)}
                        >
                          <TrashIcon />
                        </Button>
                      </>
                    )}
                    <Button
                      className="text-2xs h-auto min-h-0 w-auto min-w-0 p-1"
                      size="sm"
                      isIconOnly
                      variant="bordered"
                      onPress={() => setConfirmDelete(isDeleting ? undefined : tx.hash)}
                    >
                      {isDeleting ? (
                        <Cross1Icon />
                      ) : (
                        <TrashIcon className="text-foreground-500" />
                      )}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </>
      ) : (
        <p>You have no transactions to view.</p>
      )}
    </div>
  );
}
