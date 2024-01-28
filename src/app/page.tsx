import GovernanceCountdown from "@/components/GovernanceCountdown";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";

export default function HomePage() {
  return (
    <div className="sm:container mx-auto">
      <GovernanceCountdown />
      <TokenSupplyProgressBar />
    </div>
  );
}
