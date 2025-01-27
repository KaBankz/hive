import type { Config } from 'tailwindcss';

export default {
  content: ['./src/{app,components}/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
