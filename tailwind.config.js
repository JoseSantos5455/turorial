/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        content: ['Nutri-Light', 'sans-serif'],
        title: ['Nutri-Regular', 'sans-serif'],
        bold: ['Nutri-Bold', 'sans-serif'],
      },
      colors: {
        'blue-main': '#30b2d2',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-in-out',
      },
    },
  },
  variants: {
    animation: ['motion-safe'],
  },
  plugins: [],
};
