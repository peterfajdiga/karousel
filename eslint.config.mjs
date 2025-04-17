// @ts-check

import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    extends: [tseslint.configs.stylistic],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "semi": "error",
      "indent": ["error", 4],
    },
  }
);
