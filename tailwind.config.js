/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
export default {
  content: [
    // 包含 Remix app 的所有页面
    "./app/**/*.tsx",
    // NextUI 的组件
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui(), require("@tailwindcss/typography")],
};
