"use client";

import { MANAGE_DELEGATE_MODAL } from "@/components/_modals/ManageDelegateModal";
import { useModalState } from "@/components/_modals/ModalManagerProvider";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";

export default function VotePage({ children }: { children: React.ReactNode }) {
  const { open: openDelegateModal } = useModalState(MANAGE_DELEGATE_MODAL);

  return (
    <div className="mx-auto !max-w-screen-md p-2 sm:container sm:p-4 text-xs xs:text-sm sm:text-base">
      <div data-section="vote-header">
        <h1 className="mb-2 font-londrina-shadow text-3xl xs:text-4xl sm:mb-4 sm:text-5xl">
          Governance
        </h1>
        <p className="">
          PrimordiumDAO is owned and operated by MUSHI token holders. Tokens{" "}
          <b>
            <i>must</i>
          </b>{" "}
          be delegated to become eligible for voting on proposals. Each token holder can delegate
          their votes to themselves or to a third party.
        </p>
        <Divider className="my-4 xs:my-8 xm:my-12" />
        <div className="flex justify-center">
          <Card className="min-w-60">
            <CardHeader className="font-londrina-solid text-2xl text-foreground-600">Your MUSHI balance:</CardHeader>
            <CardBody>
              <div className="text-center text-xl">100</div>
            </CardBody>
            <CardFooter>
              <Button color="primary" fullWidth onPress={openDelegateModal}>
                Delegate Votes
              </Button>
            </CardFooter>
          </Card>
          <Card className="min-w-60 ml-12">
            <CardHeader className="font-londrina-solid text-2xl text-foreground-600">Your votes:</CardHeader>
            <CardBody>
              <div className="text-center text-xl">200</div>
            </CardBody>
            <CardFooter>
              <Button color="primary" fullWidth>
                Create Proposal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
