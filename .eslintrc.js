module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  // Extend prettier config to disable rules that conflict with prettier
  extends: ["@nuxtjs/eslint-config-typescript", "prettier", "plugin:nuxt/recommended"],
  parser: "vue-eslint-parser",
  plugins: ["simple-import-sort"],
  // add your custom rules here
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/order": "off",
    "no-console": "off",
    "vue/multi-word-component-names": "off",
  },
};
