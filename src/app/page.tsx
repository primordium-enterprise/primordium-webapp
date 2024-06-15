"use client";

import PrimordiumMainFAQ from "@/components/PrimordiumMainFAQ";
import TokenSupplyProgressBar from "@/components/TokenSupplyProgressBar";
import { GovernanceDataQuery } from "@/subgraph/subgraphQueries";
import { Button } from "@nextui-org/react";
import NextLink from "next/link";
import { Link } from "@nextui-org/react";
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
        <NextLink href="/exchange">
          <Button
            color="primary"
            size="lg"
            className="border border-foreground px-6 py-2 text-base font-medium xs:px-8 xs:py-4 xs:text-lg sm:px-16 sm:py-8 sm:text-2xl"
          >
            Join Primordium Now
          </Button>
        </NextLink>
      </div>
      <div data-section="main-faq" className="mx-auto my-2 !max-w-screen-md md:container xs:my-4">
        <PrimordiumMainFAQ />
      </div>
      <div data-section="support" className="my-2 mb-8">
        <h3 className="my-4 text-center font-londrina-shadow text-2xl xs:my-6 xs:text-3xl sm:my-8 md:text-4xl">
          Support the Open-Source Development
        </h3>
        <p className="text-center">
          Donate ETH to{" "}
          <Link
            href="https://etherscan.io/address/0xD85C88E04b00253B92e7a94f2F7Abdd75A78b88f"
            target="_blank"
          >
            bcjdev.eth.
          </Link>
        </p>
      </div>
      {/* <div className="my-2 mb-4 flex justify-center xs:my-4 xs:mb-8">
        <NextLink href="/exchange">
          <Button
            color="primary"
            size="lg"
            className="border border-foreground px-8 py-4 text-lg font-medium sm:px-16 sm:py-8 sm:text-2xl"
          >
            Join Now
          </Button>
        </NextLink>
      </div> */}
    </div>
  );
}
