import GovernanceCountdown from "@/components/GovernanceCountdown";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";

export default function HomePage() {
  return (
    <div className="mx-auto sm:container">
      <div className="my-6">
        {/* <h4 className="text-center font-londrina-shadow text-xl xs:text-2xl">welcome to</h4> */}
        <h1 className="text-center font-londrina-shadow text-4xl xs:text-5xl md:text-6xl">PrimordiumDAO</h1>
      </div>
      <GovernanceCountdown />
      <TokenSupplyProgressBar />
    </div>
  );
}
