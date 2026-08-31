import { createRequire } from "node:module";

// eslint-config-next ships its flat config as CommonJS (`export =`).
const require = createRequire(import.meta.url);
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // eslint-config-next 16 promotes these React Compiler era rules to
      // errors. They flag pre-existing patterns in this codebase that predate
      // the rules, so keep them visible as warnings until they are addressed
      // rather than failing the lint task.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
