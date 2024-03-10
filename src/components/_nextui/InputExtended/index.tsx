import { extendVariants, Input } from "@nextui-org/react";
import { inputSizeVariants } from "../nextUIExtensions";

const InputExtended = extendVariants(Input, {
  variants: {
    size: {
      ...inputSizeVariants
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default InputExtended;