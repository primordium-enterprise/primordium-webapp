import AppWagmiProvider from "./wagmi-provider";

export default function Providers({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AppWagmiProvider>
      {children}
    </AppWagmiProvider>
  );
}