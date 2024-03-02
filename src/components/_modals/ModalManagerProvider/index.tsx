"use client";

import { Dispatch, createContext, useContext, useReducer, useState } from "react";
import ManageDelegateModal from "../ManageDelegateModal";

interface ModalUpdateAction {
  modalName: string;
  update: {
    [key: string]: any;
  };
}

interface ModalState {
  isOpen?: boolean;
}

interface ModalManagerState {
  [modalName: string]: ModalState;
}

const ModalManagerContext = createContext<{
  state: ModalManagerState;
  dispatch: Dispatch<ModalUpdateAction>;
}>({
  state: {},
  dispatch: () => {},
});

const modalReducer = (state: ModalManagerState, action: ModalUpdateAction) => {
  return {
    ...state,
    [action.modalName]: {
      ...state[action.modalName],
      ...action.update,
    },
  };
};

/**
 * Hook to control a modal state by name.
 */
export const useModalState = (modalName: string) => {
  const { state: modalManagerState, dispatch } = useContext(ModalManagerContext);

  const isOpen = !!modalManagerState[modalName]?.isOpen;

  const open = () => {
    dispatch({ modalName, update: { isOpen: true } });
  };

  const close = () => {
    dispatch({ modalName, update: { isOpen: false } });
  };

  const onOpenChange = (shouldOpen: boolean) => {
    let action = shouldOpen ? open : close;
    action();
  };

  return {
    isOpen,
    open,
    close,
    onOpenChange,
  };
};

/**
 * Manage open/close states for various modals by name. To include a modal, simply add the modal component within the
 * context provider below, and then add the "useModalState" hook to any components where the modal is used.
 */
export default function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(modalReducer, {});

  return (
    <ModalManagerContext.Provider value={{ state, dispatch }}>
      {children}

      <ManageDelegateModal />
    </ModalManagerContext.Provider>
  );
}
