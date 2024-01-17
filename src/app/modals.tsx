import ChooseWalletModal from "../modals/ChooseWalletModal";

export default function Modals({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ChooseWalletModal>
      {children}
    </ChooseWalletModal>
  );
}