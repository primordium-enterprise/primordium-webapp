import { extendVariants, Input as BaseInput } from "@nextui-org/react";

const Input = extendVariants(BaseInput, {
  variants: {
    size: {
      md: {
        label: "text-2xs sm:text-tiny",
        description: "text-2xs sm:text-tiny",
        input: "text-tiny sm:text-small"
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default Input;