module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'prefer-const': ['error'],
    '@typescript-eslint/no-invalid-this': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
