// C:\Users\Melody\Documents\haliberrycake\frontend\tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          DEFAULT: '#F8A974',
          light: '#FBD6B2',
          dark: '#E7A260',
        },
        apricot: '#FBD6B2',
        blush: {
          DEFAULT: '#F2B6B8',
          light: '#F9D8D9',
          dark: '#F8A974',
        },
        golden: {
          DEFAULT: '#F6E2B5',
          dark: '#E2C892',
        },
        cream: {
          DEFAULT: '#F2E8E1',
          dark: '#E6D8CF',
        },
        brand: {
          50:  '#FDF7F2',
          100: '#F2E8E1',
          200: '#FBD6B2',
          300: '#F8A974',
          400: '#F2B6B8',
          500: '#F6E2B5',
          600: '#D9B98F',
          700: '#BEA179',
          800: '#A58B6A',
          900: '#8A7460',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.35rem, 2.5vw, 2rem)', { lineHeight: '1.2' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'luxury': '0 8px 40px rgba(248, 169, 116, 0.12), 0 2px 12px rgba(0,0,0,0.06)',
        'luxury-lg': '0 20px 60px rgba(248, 169, 116, 0.18), 0 4px 20px rgba(0,0,0,0.08)',
        'luxury-sm': '0 4px 20px rgba(248, 169, 116, 0.1), 0 1px 6px rgba(0,0,0,0.05)',
        'blush': '0 8px 40px rgba(242, 182, 184, 0.2)',
        'inner-soft': 'inset 0 2px 8px rgba(0,0,0,0.04)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FDF7F2 0%, #FBD6B2 40%, #F2B6B8 100%)',
        'gradient-peach': 'linear-gradient(180deg, #FDF7F2 0%, #FBD6B2 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F2E8E1 0%, #FBD6B2 50%, #F6E2B5 100%)',
        'gradient-cream': 'linear-gradient(180deg, #FDF7F2 0%, #F2E8E1 100%)',
        'gradient-dark-overlay': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(80, 32, 14, 0.6) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config