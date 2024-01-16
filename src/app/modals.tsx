import ConnectWalletModal from "../modals/ConnectWalletModal";

export default function Modals({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ConnectWalletModal>
      {children}
    </ConnectWalletModal>
  );
}