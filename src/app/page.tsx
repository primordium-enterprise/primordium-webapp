import GovernanceCountdown from "@/components/GovernanceCountdown";
import HowItWorks from "@/components/HowItWorks";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";
import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto sm:container">
      <div className="my-6">
        {/* <h4 className="text-center font-londrina-shadow text-xl xs:text-2xl">welcome to</h4> */}
        <h1 className="text-center font-londrina-shadow text-4xl xs:text-5xl md:text-6xl">
          PrimordiumDAO
        </h1>
      </div>
      <GovernanceCountdown />
      <TokenSupplyProgressBar />
      <div className="my-8 flex justify-center xs:my-12 sm:my-16">
        <Link href="/exchange">
          <Button
            color="primary"
            size="lg"
            className="border border-foreground px-8 py-4 text-lg font-medium sm:px-16 sm:py-8 sm:text-2xl"
          >
            Become a Member
          </Button>
        </Link>
      </div>
      <div className="mx-auto my-2 !max-w-screen-md md:container xs:my-4 ">
        <HowItWorks />
      </div>
      <div className="my-2 flex justify-center xs:my-4 mb-4 xs:mb-8">
        <Link href="/exchange">
          <Button
            color="primary"
            size="lg"
            className="border border-foreground px-8 py-4 text-lg font-medium sm:px-16 sm:py-8 sm:text-2xl"
          >
            Join Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
