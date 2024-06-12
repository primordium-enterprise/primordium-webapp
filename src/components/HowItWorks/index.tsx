"use client";

import { GovernanceData } from "@/subgraph/subgraphQueries";
import {
  Accordion,
  AccordionItem,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import dayjs from "@/wrappers/dayjs";

const generateAccordionItems = (
  timestampPopover: React.ReactNode,
): {
  title: string;
  content: React.ReactNode;
}[] => {
  return [
    {
      title: "How to join?",
      content: (
        <ul className="list">
          <li>
            To become a founding member, mint $MUSHI membership tokens by{" "}
            <Link href="/exchange">depositing ETH</Link>.
          </li>
          <li>
            <b className="text-foreground">100% of ETH deposits</b>&nbsp;go to the DAO treasury.
          </li>
          <li>
            $MUSHI holders can <Link href="/exchange?tab=withdraw">withdraw</Link> (”rage-quit”){" "}
            <b className="text-foreground">at any time,</b> burning their $MUSHI tokens and receiving
            their pro-rata share of ETH and/or ERC20 assets from the treasury.
          </li>
          <li>
            There is <b className="text-foreground">no other way to receive $MUSHI tokens.</b> No
            tokens are airdropped or minted for free,{" "}
            <b className="text-foreground">
              not even to the{" "}
              <Link href="https://bcjdevelopment.com" target="_blank">
                DAO creators
              </Link>
            </b>
            . Everyone has equal access at the same equal share price.
          </li>
        </ul>
      ),
    },
    {
      title: "How does the DAO get started?",
      content: (
        <ul className="list">
          <li>
            <b className="text-foreground">Governance cannot begin until {timestampPopover}</b>{" "}
            allowing a minimum period of time for minting $MUSHI tokens before any governance
            operations may begin.
          </li>
          <li>
            After this timestamp, $MUSHI holders can create a proposal to{" "}
            <b className="text-foreground">initialize governance.</b> The only requirement is that
            at least PERCENTAGE of the initial max $MUSHI supply is in circulation.
          </li>
          <li>
            $MUSHI holders <b className="text-foreground">vote on proposals via delegation</b>{" "}
            (originally implemented by{" "}
            <Link
              href="https://medium.com/compound-finance/compound-governance-5531f524cf68"
              target="_blank"
            >
              Compound governance
            </Link>
            ).
          </li>
          <li>
            Once the <b className="text-foreground">initialize governance</b> proposal has been{" "}
            <b className="text-foreground">passed and executed,</b> DAO members can create, vote on,
            and execute <b className="text-foreground">any further proposals they wish.</b>
          </li>
          <li>
            The DAO is in full control of all future actions, including:
            <ul className="list">
              <li>Management of ongoing $MUSHI token supply and share price</li>
              <li>Treasury operations</li>
              <li>Future business directions</li>
              <li>
                <b className="text-foreground">
                  TLDR: Whatever the DAO members vote to do, the DAO does.
                </b>
              </li>
            </ul>
          </li>
          <li>
            A truly decentralized and autonomous organization{" "}
            <b className="text-foreground">from inception.</b>
          </li>
        </ul>
      ),
    },
    {
      title: "Why become a member?",
      content: (
        <ul className="list">
          <li>
            <b className="text-foreground">You are in control.</b> Create and vote on proposals.
            Receive pro-rata profit distributions. Dissolve your membership at{" "}
            <b className="text-foreground">any time,</b> leaving with your fair share of the
            treasury.
          </li>
          <li>
            <b className="text-foreground">Everything is on-chain.</b> All membership and governance
            functions are managed by{" "}
            <Link
              href="https://github.com/PrimordiumDAO/primordium-contracts/blob/main/contracts.md"
              target="_blank"
            >
              verified smart contracts
            </Link>
            . No middlemen. No closed doors.{" "}
            <b className="text-foreground">Radical transparency.</b>
          </li>
        </ul>
      ),
    },
    {
      title: "Why PrimordiumDAO?",
      content: (
        <ul className="list">
          <li>
            Primordium is a <b className="text-foreground">for-profit business DAO</b> (the first of
            its kind).
          </li>
          <li>
            Primordium is spear-heading a <b className="text-foreground">new movement</b> of{" "}
            <b className="text-foreground">for-profit business DAOs.</b>
          </li>
          <li>It is equal opportunity for all.</li>
          <li>
            Learn more:
            <ul className="list">
              <li>
                <Link href="https://primordiumdao.xyz/whitepaper.pdf" target="_blank">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="https://primordiumdao.xyz" target="_blank">
                  Primordium website
                </Link>
              </li>
              <li>
                {"Creator's "}
                <Link href="https://primordiumdao.xyz/primordium-network.pdf" target="_blank">
                  business plan
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      ),
    },
  ];
};

const generateTimestampPopoverContent = (
  governanceData?: GovernanceData,
  isClient: boolean = false,
): React.ReactNode => {
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const beginDate = governanceData
    ? dayjs.unix(Number(governanceData.governanceCanBeginAt)).format("MMMM Do")
    : "March 25th";

  return governanceData ? (
    <Popover showArrow>
      <PopoverTrigger>
        <span className="cursor-pointer text-primary-600">{beginDate}</span>
      </PopoverTrigger>
      <PopoverContent className="max-w-[360px]">
        <p className="text-xs xs:text-sm sm:text-base">
          Governance can begin starting at {governanceData.governanceCanBeginAt} UTC.
          {isClient &&
            ` Locally, that would be ${new Date(Number(governanceData.governanceCanBeginAt) * 1000).toLocaleString(undefined, dateFormatOptions)}`}
        </p>
      </PopoverContent>
    </Popover>
  ) : (
    <>{beginDate}</>
  );
};

export default function HowItWorks({ governanceData }: { governanceData?: GovernanceData }) {
  const [accordionItems, setAccordionItems] = useState(
    generateAccordionItems(generateTimestampPopoverContent()),
  );

  useEffect(() => {
    setAccordionItems(
      generateAccordionItems(generateTimestampPopoverContent(governanceData, true)),
    );
  }, [governanceData]);

  return (
    <Accordion
      selectionMode="multiple"
      defaultExpandedKeys={accordionItems.map((item) => item.title)}
    >
      {accordionItems.map((item) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          aria-label={`Accordion - ${item.title}`}
          classNames={{
            title: "text-xl xs:text-2xl sm:text-3xl font-londrina-solid",
            content: "pl-1 text-foreground-600 font-roboto-mono",
          }}
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
