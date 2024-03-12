import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "2xs": "320px",
        xs: "450px",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      fontFamily: {
        inter: "var(--font-inter)",
        "londrina-shadow": "var(--font-londrina-shadow)",
        "londrina-solid": "var(--font-londrina-solid)",
        "roboto-mono": "var(--font-roboto-mono)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      flex: {
        "1rem": "0 0 1rem",
      },
      translate: {
        "center": ""
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
