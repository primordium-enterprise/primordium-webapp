import { extendVariants, Button } from "@nextui-org/react";

const ButtonExtended = extendVariants(Button, {
  variants: {
    size: {
      sm: "px-unit-2 xs:px-unit-3 h-unit-7 xs:h-unit-8 text-2xs xs:text-small",
      md: "px-unit-3 xs:px-unit-4 h-unit-9 xs:h-unit-10 text-small xs:text-base",
    }
  },
  defaultVariants: {
    size: "md",
  }
});

export default ButtonExtended;