import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // Basic rules only
      "no-unused-vars": "off", // TypeScript handles this
      "prefer-const": "error"
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "prefer-const": "error"
    }
  },
  {
    ignores: [
      ".next/**",
      "out/**", 
      "node_modules/**",
      "*.config.*"
    ]
  }
];

export default eslintConfig;