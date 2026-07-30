export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        mobile: { max: '899px' },
        nav: '900px',
      },
      colors: {
        // Dark red, brand primary
        primary: {
          50: '#fbf3f3',
          100: '#f6e4e4',
          200: '#eeccce',
          300: '#e0a5a9',
          400: '#cc747b',
          500: '#b04d56',
          600: '#8f2f3a',
          700: '#7a2530',
          800: '#661f28',
          900: '#571c23',
          950: '#300c11',
        },
        // Bone white, brand secondary
        secondary: {
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#f3ede1',
          300: '#e9dfc8',
          400: '#dcccac',
          500: '#cbb78d',
          600: '#b39c6c',
          700: '#937d54',
          800: '#766345',
          900: '#61513b',
          950: '#332a1e',
        },
        // Sage green, calm accent that pairs with the dark red/bone-white pair
        accent: {
          50: '#f4f6f2',
          100: '#e6ebe0',
          200: '#cdd8c3',
          300: '#adc09d',
          400: '#8ba579',
          500: '#6f8c5c',
          600: '#577048',
          700: '#46593a',
          800: '#3a4931',
          900: '#313c2a',
          950: '#192015',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
