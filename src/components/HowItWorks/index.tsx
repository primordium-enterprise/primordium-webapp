"use client";

import { Accordion, AccordionItem, Link } from "@nextui-org/react";

const accordianItems: {
  title: string;
  content: React.ReactNode;
}[] = [
  {
    title: "How to join?",
    content: (
      <ul>
        <li>
          To become a founding member, mint MUSHI membership tokens by{" "}
          <Link href="/exchange">depositing ETH.</Link>
        </li>
        <li>
          <b>100% of ETH deposits</b>&nbsp;go to the DAO treasury.
        </li>
        <li>
          MUSHI holders can <Link href="/exchange?tab=withdraw">withdraw</Link> (”rage-quit”){" "}
          <b>at any time,</b> burning their MUSHI tokens and receiving their pro-rata share of ETH
          and/or ERC20 assets from the treasury.
        </li>
        <li>
          There is <b>no other way to receive MUSHI tokens.</b> No tokens are airdropped or minted
          for free,{" "}
          <b>
            not even to the <Link href="https://bcjdevelopment.com">DAO creators.</Link>
          </b>{" "}
          Everyone has equal access at the same equal share price.
        </li>
      </ul>
    ),
  },
];

export default function HowItWorks() {
  return (
    <Accordion defaultExpandedKeys={accordianItems.map((item) => item.title)}>
      {accordianItems.map((item) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          aria-label={`Accordion - ${item.title}`}
          classNames={{ title: "text-base", content: "pl-1 text-foreground-600" }}
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
