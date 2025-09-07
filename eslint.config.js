import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser';

export default [
  // 忽略文件
  {ignores: ['dist', 'node_modules', 'public', 'eslint.config.js'],},
  // vue3 基础推荐规则
  ...eslintPluginVue.configs['flat/recommended'],
  // ts 默认推荐规则
  ...tsEslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,vue}'],
    // eslint 默认推荐规则
    ...pluginJs.configs.recommended,
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 2021,
      globals: {...globals.browser, ...globals.es2021, ...globals.node},
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'indent': ['error', 2, {
        'SwitchCase': 1
      }],
      'semi': [1, 'never'],
      'quotes': ['error', 'single'],
      'prefer-template': 'error',
      'space-before-function-paren': ['error', {
        'anonymous': 'never',
        'named': 'never',
        'asyncArrow': 'never'
      }],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
    },
  }
]
