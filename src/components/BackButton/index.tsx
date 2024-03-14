"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link, { LinkProps } from "next/link";

export default function BackButton(props: LinkProps) {
  return (
    <Link {...props}>
      <div className="relative h-6 w-6 rounded-full border-[1px] border-foreground-600 transition-colors hover:bg-foreground-200 xs:h-8 xs:w-8">
        <ArrowLeftIcon className="absolute left-[50%] top-[50%] h-3 w-3 translate-x-[-50%] translate-y-[-50%] sm:h-4 sm:w-4" />
      </div>
    </Link>
  );
}
