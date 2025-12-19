import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  typescript: true,
  formatters: true,
  rules: {
    'antfu/top-level-function': 'off',
    'ts/no-empty-object-type': 'off',
    'style/operator-linebreak': ['error', 'after'],
  },
})
