import GovernanceCountdown from "@/components/GovernanceCountdown";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";
import { londrina_shadow } from "./fonts";

export default function HomePage() {
  return (
    <div className="mx-auto sm:container">
      <h1 className={`${londrina_shadow.className} my-4 text-center text-5xl`}>
        Welcome to Primordium DAO
      </h1>
      <h3 className="text-center text-xl">
        <span className="text-foreground-500">DAO Status: </span>
        <b className="text-primary-800">FOUNDING</b>
      </h3>
      <GovernanceCountdown />
      <TokenSupplyProgressBar />
    </div>
  );
}
