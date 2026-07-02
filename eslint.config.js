const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const globals = require("globals");

const nodeTsProject = (files) => ({
  files,
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: "module" },
    globals: { ...globals.node, ...globals.jest },
  },
  plugins: { "@typescript-eslint": tseslint },
  rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
});

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/functions/lib/**",
      "packages/*/lib/**",
      "**/.expo/**",
      "**/coverage/**",
      "apps/mobile/android/**",
      "apps/mobile/ios/**",
    ],
  },
  nodeTsProject(["packages/shared/src/**/*.ts", "apps/functions/src/**/*.ts"]),
  ...expoConfig.map((config) => ({
    ...config,
    files: config.files ?? ["apps/mobile/**/*.{ts,tsx,js,jsx}"],
  })),
  {
    files: ["**/jest.config.js", "**/jest.setup.js", "**/babel.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest },
    },
  },
  prettierConfig,
];
