module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  // Extend prettier config to disable rules that conflict with prettier
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier', 'plugin:nuxt/recommended'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
