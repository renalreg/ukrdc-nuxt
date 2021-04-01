module.exports = {
  purge: [],
  content: ['node_modules/tv-*/dist/tv-*.umd.min.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    variants: {
      extend: {
        opacity: ['disabled'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
