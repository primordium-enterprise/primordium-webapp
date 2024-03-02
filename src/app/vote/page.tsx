"use client";

import { MANAGE_DELEGATE_MODAL } from "@/components/_modals/ManageDelegateModal";
import { useModalState } from "@/components/_modals/ModalManagerProvider";
import { Button } from "@nextui-org/react";

export default function VotePage({ children }: { children: React.ReactNode }) {
  const { open, close } = useModalState(MANAGE_DELEGATE_MODAL);

  return (
    <div>
      <div data-section="vote-header">
        <div className="flex justify-end">
          <Button color="primary" onPress={open}>
            Delegate Votes
          </Button>
        </div>
      </div>
    </div>
  );
}
