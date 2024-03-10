import { extendVariants, Textarea } from "@nextui-org/react";
import { inputSizeVariants } from "../nextUIExtensions";

const TextareaExtended = extendVariants(Textarea, {
  variants: {
    size: {
      ...inputSizeVariants
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default TextareaExtended;