'use client'

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link, { LinkProps } from "next/link";

export default function BackButton(props: LinkProps) {
  return (
    <Link {...props}>
      <div className="relative rounded-full h-6 xs:h-8 w-6 xs:w-8 border-[1px] border-foreground-600">
        <ArrowLeftIcon className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-3 h-3 sm:w-4 sm:h-4" />
      </div>
    </Link>
  );
}