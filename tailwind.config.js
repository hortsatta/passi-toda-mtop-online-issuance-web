import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2e73dc',
        accent: {
          DEFAULT: '#f4a203',
        },
        backdrop: {
          DEFAULT: '#121212',
          surface: '#18181c',
          field: 'rgba(217,217,217, 0.05)',
          'field-primary': '#855800',
        },
        text: 'rgba(255,255,255, 0.8)',
      },
      fontFamily: {
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
