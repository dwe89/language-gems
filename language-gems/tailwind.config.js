/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      opacity: {
        '25': '0.25',
      },
      backgroundOpacity: {
        '25': '0.25',
      }
    },
  },
  plugins: [],
  // Ensure all variants are available for opacity utilities
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
      backgroundOpacity: ['hover', 'focus'],
      opacity: ['hover', 'focus'],
    },
  },
}; 