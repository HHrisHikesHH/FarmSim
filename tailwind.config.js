/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#2C1A0E',
        clay: '#7B3F1A',
        terracotta: '#C2622D',
        ochre: '#D4953A',
        wheat: '#E8C97A',
        straw: '#F5ECD1',
        leaf: '#3A6B35',
        mint: '#6BAF65',
        sky: '#4A7FA5',
        farmBg: '#FAF6EE',
        card: '#FFFFFF',
        border: '#E2D5C0',
        farmText: '#1E1208',
        muted: '#7A6550',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
