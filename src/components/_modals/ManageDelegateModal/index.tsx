'use client'

import { Modal, ModalContent } from "@nextui-org/react";
import { useModalState } from "../ModalManagerProvider";

export const MANAGE_DELEGATE_MODAL = "ManageDelegateModal";

export default function ManageDelegateModal() {
  const { isOpen, onOpenChange } = useModalState(MANAGE_DELEGATE_MODAL);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <p>Test delegate modal</p>
      </ModalContent>
    </Modal>
  );
}