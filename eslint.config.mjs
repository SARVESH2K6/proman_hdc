import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
  {
    rules: {
      // Enforce consistent imports
      "import/order": "off",
      // Disallow console.log in production (warn only)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // React 19 — no longer need React in scope
      "react/react-in-jsx-scope": "off",
      // Enforce typed Hook dependencies
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);

export default eslintConfig;
