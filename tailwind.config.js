/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 🌟 1. index.html を含める
    "./index.html",
    // 🌟 2. srcディレクトリ以下の全てのJS/JSX/TS/TSXファイルを対象にする
    //      これがないと、Reactコンポーネント内のクラスが認識されません
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
