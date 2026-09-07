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
        display: ['"Antonia"', 'var(--font-antonia)', 'Georgia', 'serif'],
        body: ['"Elza"', 'var(--font-elza)', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Elza"', 'var(--font-elza)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Antonia"', 'var(--font-antonia)', 'Georgia', 'serif'],
        lora: ['"Elza"', 'var(--font-elza)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
