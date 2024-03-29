import SharesExchanger from "@/components/SharesExchanger";

export default function ExchangePage() {
  return (
    <div>
      <main className="px-4 py-8">
        <section className="text-center">
          <h1 className="font-londrina-shadow my-2 text-5xl">Join PrimordiumDAO</h1>
          <p className="my-2 text-sm text-foreground-500">
            Mint MUSHI membership shares by depositing ETH. 100% of the deposited funds go to the DAO treasury. You
            can withdraw your share of the funds at any time.
          </p>
        </section>
        <SharesExchanger />
      </main>
    </div>
  );
}