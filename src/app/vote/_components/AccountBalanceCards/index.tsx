"use client";

import { MANAGE_DELEGATE_MODAL } from "@/components/_modals/ManageDelegateModal";
import { useModalState } from "@/components/_modals/ModalManagerProvider";
import { MemberPlusDelegateQuery } from "@/subgraph/subgraphQueries";
import abbreviateBalance from "@/utils/abbreviateBalance";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";
import { useAccount } from "wagmi";

type BaseProps = { children: React.ReactNode; className?: string };

const BalanceCard = ({ children, className }: BaseProps) => (
  <Card className={`w-full max-w-80 sm:w-auto sm:min-w-72 ${className || ""}`}>{children}</Card>
);

const BalanceCardHeader = ({ children }: BaseProps) => (
  <CardHeader className="font-londrina-solid text-lg text-foreground-600 xs:text-xl sm:text-2xl">
    {children}
  </CardHeader>
);

const BalanceCardBody = ({ children }: BaseProps) => (
  <CardBody className="py-0 text-center text-sm xs:text-base sm:py-1 sm:text-lg">
    {children}
  </CardBody>
);

export default function AccountBalanceCards() {
  const { open: openDelegateModal } = useModalState(MANAGE_DELEGATE_MODAL);
  const { address } = useAccount();

  const [queryResult] = useQuery({
    query: MemberPlusDelegateQuery,
    variables: { address },
    pause: !address,
  });
  const { data, fetching, error } = queryResult;

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const { mushiBalance, mushiBalanceFormatted, votesBalance, votesBalanceFormatted } =
    useMemo(() => {
      let mushiBalance = BigInt(0);
      let votesBalance = BigInt(0);

      if (data) {
        if (data.member) {
          mushiBalance = BigInt(data.member.tokenBalance);
        }
        if (data.delegate) {
          votesBalance = BigInt(data.delegate.delegatedVotesBalance);
        }
      }

      return {
        mushiBalance,
        mushiBalanceFormatted: abbreviateBalance(mushiBalance),
        votesBalance,
        votesBalanceFormatted: abbreviateBalance(votesBalance),
      };
    }, [data]);

  return (
    <div className="flex flex-col items-center justify-center sm:flex-row">
      <BalanceCard>
        <BalanceCardHeader>Your MUSHI balance:</BalanceCardHeader>
        <BalanceCardBody>{mushiBalanceFormatted}</BalanceCardBody>
        <CardFooter>
          <Button
            color="primary"
            fullWidth
            className="h-unit-8 text-sm sm:h-unit-10 sm:text-base"
            onPress={openDelegateModal}
            isLoading={fetching}
            variant={!address || mushiBalance === BigInt(0) ? "flat" : "solid"}
          >
            Delegate Votes
          </Button>
        </CardFooter>
      </BalanceCard>
      <BalanceCard className="mt-4 sm:ml-12 sm:mt-0">
        <BalanceCardHeader>Your votes:</BalanceCardHeader>
        <BalanceCardBody>{votesBalanceFormatted}</BalanceCardBody>
        <CardFooter>
          <Button
            color="primary"
            fullWidth
            className="h-unit-8 text-sm sm:h-unit-10 sm:text-base"
            isLoading={fetching}
          >
            Create Proposal
          </Button>
        </CardFooter>
      </BalanceCard>
    </div>
  );
}
