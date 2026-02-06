import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "frontend/dist/**",
      "bitwig-controller/dist/**",
      "bitwig-controller/**/*.js",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    files: ["bitwig-controller/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        loadAPI: "readonly",
        host: "readonly",
        load: "readonly",
        println: "readonly",
      },
    },
  },
]);
