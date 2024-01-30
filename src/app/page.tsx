import GovernanceCountdown from "@/components/GovernanceCountdown";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";
import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto sm:container">
      <div className="my-6">
        {/* <h4 className="text-center font-londrina-shadow text-xl xs:text-2xl">welcome to</h4> */}
        <h1 className="xs:text-5xl text-center font-londrina-shadow text-4xl md:text-6xl">
          PrimordiumDAO
        </h1>
      </div>
      <GovernanceCountdown />
      <TokenSupplyProgressBar />
      <div className="flex justify-center my-16">
        <Link href="/exchange">
          <Button
            color="primary"
            size="lg"
            className="border border-foreground px-8 py-4 text-lg sm:px-16 sm:py-8 sm:text-2xl font-medium"
          >
            Become a Member
          </Button>
        </Link>
      </div>
    </div>
  );
}
