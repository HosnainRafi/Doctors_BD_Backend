import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
  },
  {
    plugins: {
      jsdoc: jsdoc,
    },
  },
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
    rules: {
      eqeqeq: "off",
      "no-unused-expressions": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
      "jsdoc/require-description": "error",
      "jsdoc/check-values": "error",
      "no-console": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
]);
