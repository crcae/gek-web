import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4DB26B',
          navy: '#2C3E4B',
          gray: '#D7D7D7',
          white: '#F4F3F4',
        }
      },
      fontFamily: {
        display: ['var(--font-playfair-display)', 'serif'],
        body: ['var(--font-lora)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
