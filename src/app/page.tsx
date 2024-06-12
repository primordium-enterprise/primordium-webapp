'use client';

import GovernanceCountdown from "@/components/GovernanceCountdown";
import HowItWorks from "@/components/HowItWorks";
import PrimordiumMainFAQ from "@/components/PrimordiumMainFAQ";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";
import { GovernanceDataQuery } from "@/subgraph/subgraphQueries";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useQuery } from "urql";

export default function HomePage() {
  const [governanceDataResult] = useQuery({ query: GovernanceDataQuery });

  return (
    <div data-section="home-page">
      <div className="my-6">
        <h1 className="text-center font-londrina-shadow text-4xl xs:text-5xl md:text-6xl">
          Primordium
        </h1>
      </div>
      <TokenSupplyProgressBar governanceDataResult={governanceDataResult} />
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
      <div
        data-section="main-faq"
        className="mx-auto my-2 !max-w-screen-md md:container xs:my-4"
      >
        <PrimordiumMainFAQ />
      </div>
      {/* <div
        data-section="how-it-works"
        className="mx-auto my-2 !max-w-screen-md md:container xs:my-4"
      >
        <HowItWorks governanceData={governanceDataResult.data?.governanceData} />
      </div> */}
      <div className="my-2 mb-4 flex justify-center xs:my-4 xs:mb-8">
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
