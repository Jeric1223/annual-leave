import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          bg: '#f3e8ff',
        },
      },
    },
  },
} satisfies Config
