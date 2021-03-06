module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: { max: 3, allowFirstLine: true }
      }
    ],
    'template-curly-spacing': 'off',
    camelcase: 'warn',
    'no-irregular-whitespace': 'off',
    'no-unused-vars': 'warn',
    quotes: 'warn',
    'no-multiple-empty-lines': ['error', { max: 2 }]
  }
}
