import SharesExchanger from "@/components/SharesExchanger";

export default function Home() {
  return (
    <div className="sm:container mx-auto">
      <main className="px-4 py-8">
        <section className="text-center">
          <h1 className="font-londrina-shadow my-2 text-5xl">Join the Primordium DAO</h1>
          <p className="my-2 text-sm text-foreground-500">
            Deposit ETH to mint share tokens. 100% of deposited funds go to the DAO treasury. You
            can withdraw your funds at any time.
          </p>
        </section>
        <SharesExchanger />
      </main>
    </div>
  );
}
