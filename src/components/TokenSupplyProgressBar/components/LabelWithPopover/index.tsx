"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { CSSProperties } from "react";

type PopoverProps = React.ComponentProps<typeof Popover>;

interface Props extends Omit<PopoverProps, "children"> {
  style?: CSSProperties;
  className?: string;
  label?: string;
  titleText?: string;
  content?: string;
}

export default function LabelWithPopover({
  style,
  className,
  label,
  titleText,
  content,
  ...popoverProps
}: Props) {
  return (
    <div className={`${className} flex items-center text-sm md:text-base`} style={style}>
      {label !== "" && (
        <>
          {label}
          <Popover offset={10} {...popoverProps}>
            <PopoverTrigger>
              <InfoCircledIcon
                className={`${label !== undefined ? "ml-1" : ""} inline hover:cursor-pointer`}
              />
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px] items-start">
              {titleText && <h6 className="text-small font-bold">{titleText}</h6>}
              <p className="text-tiny">{content}</p>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
}
