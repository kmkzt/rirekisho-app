module.exports = {
  extends: ['@kmkzt/eslint-config/lib/javascript'],
  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      extends: ['@kmkzt/eslint-config/lib/react'],
      rules: {
        // TODO: Update React v17
        // For next.
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@kmkzt/eslint-config/lib/typescript'],
    },
    // {
    //   files: ['*.test.*', '*.spec.*'],
    //   extends: ['@kmkzt/eslint-config/lib/jest'],
    // },
    // {
    //   files: ['scripts/**'],
    //   extends: ['@kmkzt/eslint-config/lib/node'],
    // },
  ],
}
