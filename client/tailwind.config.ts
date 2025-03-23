import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            'custom-linear': 'linear-gradient(18deg, rgb(214, 219, 220) 0% 50%, rgb(33, 33, 33) 50% 100%)',
    
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',  /* Internet Explorer 10+ */
          'scrollbar-width': 'none',     /* Firefox */
        },
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',             /* Safari and Chrome */
        },
      }, ['responsive'])
    }
  ],
};
export default config;
