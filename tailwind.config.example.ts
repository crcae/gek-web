// tailwind.config.ts — copiar y renombrar al instalar el proyecto
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4DB26B',   // Verde principal — acentos, CTAs, líneas decorativas
          navy:  '#2C3E4B',   // Azul marino — textos, navbar, fondos oscuros
          gray:  '#D7D7D7',   // Gris claro — bordes, separadores
          white: '#F4F3F4',   // Blanco humo — fondos de página
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'], // Reemplaza fuente Elza del manual
        body:    ['"Lora"', 'serif'],             // Reemplaza fuente Antonia del manual
      },
    },
  },
  plugins: [],
}
export default config
