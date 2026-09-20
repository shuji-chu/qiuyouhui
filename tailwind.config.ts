import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00b96b',
          dark: '#009456',
        },
      },
    },
  },
  plugins: [],
};

export default config;
