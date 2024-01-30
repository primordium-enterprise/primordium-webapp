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
          To become a founding member, mint MUSHI membership tokens by&nbsp;
          <Link href="/exchange">depositing ETH</Link>.
        </li>
        <li>
          <b>100% of ETH deposits</b>&nbsp;go to the DAO treasury.
        </li>
      </ul>
    ),
  },
];

export default function HowItWorks() {
  return (
    <Accordion defaultExpandedKeys={accordianItems.map(item => item.title)}>
      {accordianItems.map((item) => (
        <AccordionItem key={item.title} title={item.title} aria-label={`Accordion - ${item.title}`}>
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
