import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFEEE',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#1E1E1E',
          foreground: '#FFFFFF',
        },
        linkedin: '#0072B1',
        github: '#171515',
        indonesia: '#FFFFFF',
        uk: '#012169',
      },
    },
  },
  plugins: [nextui()],
  darkMode: 'class',
};
export default config;
