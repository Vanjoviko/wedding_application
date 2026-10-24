/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 90,
};

export default config;
