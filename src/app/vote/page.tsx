"use client";

import { MANAGE_DELEGATE_MODAL } from "@/components/_modals/ManageDelegateModal";
import { useModalState } from "@/components/_modals/ModalManagerProvider";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import AccountBalanceCards from "./_components/AccountBalanceCards";

export default function VotePage({ children }: { children: React.ReactNode }) {
  const { open: openDelegateModal } = useModalState(MANAGE_DELEGATE_MODAL);

  return (
    <div className="text-xs xs:text-sm sm:p-4 sm:text-base">
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
        <Divider className="xm:my-12 my-4 xs:my-8" />
        <AccountBalanceCards />
      </div>
    </div>
  );
}
