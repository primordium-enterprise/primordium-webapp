import SharesExchanger from "@/components/SharesExchanger";

export default function ExchangePage() {
  return (
    <div>
      <main className="px-4 py-8">
        <section className="text-center">
          <h1 className="my-2 font-londrina-shadow text-5xl">Join Primordium</h1>
          <p className="my-2 text-sm text-foreground-500">
            Deposit ETH to mint $MUSHI membership tokens. 100% of the deposited funds go to
            Primordium's treasury. Members can withdraw their share of treasury funds at any time.
          </p>
        </section>
        <SharesExchanger />
      </main>
    </div>
  );
}
