import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/{app,components}/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        marquee: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(calc(-50% - var(--gap)/2))',
          },
        },
        'marquee-vertical': {
          from: {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(calc(-100% - var(--gap)))',
          },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(50% + var(--gap)/2))' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
