import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', 'class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		animation: {
  			'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
  			marquee: 'marquee var(--duration) linear infinite',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
  			'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
  			'spin-slow': 'spin 3s linear infinite',
  			'spin-reverse-slow': 'spin-reverse 4s linear infinite',
  			'spin-reverse-slower': 'spin-reverse 6s linear infinite',
  			'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
  			meteor: 'meteor 5s linear infinite'
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					color: 'inherit',
  					a: {
  						color: 'inherit',
  						textDecoration: 'none'
  					},
  					'--tw-prose-body': 'inherit',
  					'--tw-prose-headings': 'inherit',
  					'--tw-prose-lead': 'inherit',
  					'--tw-prose-links': 'inherit',
  					'--tw-prose-bold': 'inherit',
  					'--tw-prose-counters': 'inherit',
  					'--tw-prose-bullets': 'inherit',
  					'--tw-prose-hr': 'inherit',
  					'--tw-prose-quotes': 'inherit',
  					'--tw-prose-quote-borders': 'inherit',
  					'--tw-prose-captions': 'inherit',
  					'--tw-prose-code': 'inherit',
  					'--tw-prose-pre-code': 'inherit',
  					'--tw-prose-pre-bg': 'inherit',
  					'--tw-prose-th-borders': 'inherit',
  					'--tw-prose-td-borders': 'inherit'
  				}
  			}
  		},
  		keyframes: {
  			'border-beam': {
  				'100%': {
  					'offset-distance': '100%'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-50% - var(--gap)/2))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-reverse': {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(50% + var(--gap)/2))'
  				}
  			},
  			'spin-reverse': {
  				from: {
  					transform: 'rotate(360deg)'
  				},
  				to: {
  					transform: 'rotate(0deg)'
  				}
  			},
  			meteor: {
  				'0%': {
  					transform: 'rotate(215deg) translateX(0)',
  					opacity: '1'
  				},
  				'70%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'rotate(215deg) translateX(-500px)',
  					opacity: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [typography],
};

export default config;
