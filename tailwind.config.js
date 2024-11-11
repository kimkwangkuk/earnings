/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // src 폴더 내의 모든 JS/JSX/TS/TSX 파일
    "./public/index.html",         // public 폴더의 HTML 파일
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Pretendard',
          'system-ui',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}

