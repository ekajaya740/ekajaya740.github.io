import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
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
    colors: {
      ...colors,
      primary: '#FFFEEE',
      accent: '#1E1E1E',
    },
  },
  // darkMode: 'class',
  // plugins: [nextui()],
};
export default config;
