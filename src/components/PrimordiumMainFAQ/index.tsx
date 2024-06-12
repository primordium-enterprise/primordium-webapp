"use client";

import hrefs from "@/config/hrefs";
import { Accordion, AccordionItem, Link } from "@nextui-org/react";
import React from "react";

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

const accordionItems: AccordionItem[] = [
  {
    title: "What is Primordium?",
    content: (
      <p>
        A decentralized business enterprise. Read the whitepaper <Link target="_blank">here</Link>.
      </p>
    ),
  },
  {
    title: "How does Primordium make money?",
    content: (
      <p>
        However the members want to. But,{" "}
        <Link href={hrefs.bcjdev} target="_blank">
          bcj.dev
        </Link>{" "}
        does have a{" "}
        <Link href={hrefs.bcjdev_business_plan} target="_blank">
          proposed business model
        </Link>
        .
      </p>
    ),
  },
];

export default function PrimordiumMainFAQ() {
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
            content: "text-xs xs:text-sm sm:text-base text-foreground-600 font-roboto-mono pl-4 xs:pl-6 pb-4 xs:pb-6",
          }}
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
