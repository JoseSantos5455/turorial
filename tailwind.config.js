/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right,#52b788, #3a86ff)',
      },
      fontFamily: {
        SemiBold: ['R-SemiBold', 'sans-serif'],
        Regular: ['R-Regular', 'sans-serif'],
        Light: ['R-Light', 'sans-serif'],
        ExtraBold: ['R-ExtraBold', 'sans-serif'],
        ExtraLight: ['R-ExtraLight', 'sans-serif'],
        Bold: ['R-Bold', 'sans-serif'],
        Medium: ['R-Medium', 'sans-serif'],
      },
      colors: {
        'blue-main': '#30b2d2',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        move: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(75%)' },
          '100%': { transform: 'translateX(500%)' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-in-out',
        move: 'move 20s linear infinite',
        'fade-in-out': 'fadeInOut 10s ease-in-out infinite',
      },
    },
  },
  variants: {
    animation: ['motion-safe'],
  },
  plugins: [],
};
