"use client";

import { MANAGE_DELEGATE_MODAL } from "@/components/_modals/ManageDelegateModal";
import { useModalState } from "@/components/_modals/ModalManagerProvider";
import { MemberPlusDelegateQuery } from "@/subgraph/subgraphQueries";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useQuery } from "urql";
import { useAccount } from "wagmi";

type BaseProps = { children: React.ReactNode, className?: string };

const BalanceCard = ({ children, className }: BaseProps) => (
  <Card className={`w-full max-w-80 sm:w-auto sm:min-w-72 ${className || ""}`}>{children}</Card>
);

const BalanceCardHeader = ({ children }: BaseProps) => (
  <CardHeader className="font-londrina-solid text-lg text-foreground-600 xs:text-xl sm:text-2xl">
    {children}
  </CardHeader>
);

const BalanceCardBody = ({ children }: BaseProps) => (
  <CardBody className="py-0 sm:py-1 text-center text-sm xs:text-base sm:text-lg">{children}</CardBody>
);

export default function AccountBalanceCards() {
  const { open: openDelegateModal } = useModalState(MANAGE_DELEGATE_MODAL);
  const { address } = useAccount();

  const [queryResult] = useQuery({ query: MemberPlusDelegateQuery, variables: { address }, pause: !address });


  return (
    <div className="flex flex-col items-center justify-center sm:flex-row">
      <BalanceCard>
        <BalanceCardHeader>
          Your MUSHI balance:
        </BalanceCardHeader>
        <BalanceCardBody>
          100
        </BalanceCardBody>
        <CardFooter>
          <Button
            color="primary"
            fullWidth
            className="h-unit-8 text-sm sm:h-unit-10 sm:text-base"
            onPress={openDelegateModal}
          >
            Delegate Votes
          </Button>
        </CardFooter>
      </BalanceCard>
      <BalanceCard className="mt-4 sm:mt-0 sm:ml-12">
        <BalanceCardHeader>
          Your votes:
        </BalanceCardHeader>
        <BalanceCardBody>
          200
        </BalanceCardBody>
        <CardFooter>
          <Button color="primary" fullWidth className="h-unit-8 text-sm sm:h-unit-10 sm:text-base">
            Create Proposal
          </Button>
        </CardFooter>
      </BalanceCard>
    </div>
  );
}
