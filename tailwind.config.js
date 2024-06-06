import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        main: '1120px',
      },
      colors: {
        primary: {
          DEFAULT: '#2e73dc',
          'button-hover': '#125dce',
        },
        accent: {
          DEFAULT: '#f4a203',
          'button-hover': '#d8870d',
        },
        backdrop: {
          DEFAULT: '#121212',
          surface: '#18181c',
          'surface-accent': '#d98f00',
          input: 'rgba(217,217,217, 0.05)',
          'input-primary': '#855800',
          'input-hover': 'rgba(217,217,217, 0.1)',
        },
        text: 'rgba(255,255,255, 0.8)',
        border: {
          DEFAULT: 'rgba(255,255,255, 0.1)',
        },
      },
      fontFamily: {
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        ltr: {
          '0%': { left: '-25%', opacity: 0 },
          '50%': { opacity: 1 },
          '75%': { opacity: 1 },
          '100%': { left: '100%', opacity: 0 },
        },
      },
      animation: {
        loading: 'ltr 1s linear infinite',
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
