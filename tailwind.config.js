module.exports = {
  content: ["./src/**/*.{tsx, ts, js, jsx}"],
  darkMode: "class",  
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans TC"'],
        serif: ['"Noto Serif"', '"Noto Serif TC"'],
        mono: ['"Noto Sans Mono"'],
      },
      zIndex: {
        max: "2147483647",
      },
    },
  },
  plugins: [],
};
