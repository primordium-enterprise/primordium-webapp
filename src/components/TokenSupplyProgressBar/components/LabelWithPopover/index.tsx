"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { CSSProperties } from "react";

type PopoverProps = React.ComponentProps<typeof Popover>;

interface Props extends Omit<PopoverProps, "children"> {
  style?: CSSProperties;
  className?: string;
  label?: React.ReactNode;
  titleText?: string;
  contentItems?: React.ReactNode;
  hide?: boolean;
}

export default function LabelWithPopover({
  style,
  className,
  label,
  titleText,
  contentItems,
  hide,
  ...popoverProps
}: Props) {
  return (
    <div
      className={`${className} absolute flex items-center font-roboto-mono text-sm md:text-base`}
      style={style}
    >
      {!hide && label !== "" && (
        <>
          {label}
          {contentItems && (
            <Popover offset={10} {...popoverProps} showArrow>
              <PopoverTrigger>
                <InfoCircledIcon
                  className={`inline size-5 p-0.5 text-primary-700 hover:cursor-pointer md:size-6 md:p-1`}
                />
              </PopoverTrigger>
              <PopoverContent className="max-w-[220px] items-start">
                {titleText && <h6 className="text-small font-bold">{titleText}</h6>}
                <p className="text-tiny">{contentItems}</p>
              </PopoverContent>
            </Popover>
          )}
        </>
      )}
    </div>
  );
}
