import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import type { Rule } from 'eslint'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

// Custom rule to prevent importing underscore-prefixed functions outside of test files
const noUnderscoreImportsOutsideTests: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent importing underscore-prefixed functions outside of test files',
    },
    schema: [], // no options
  },
  create(context) {
    return {
      ImportSpecifier(node: Rule.Node) {
        const importedName = (node as any).imported.name
        const filename = context.getFilename()

        if (importedName.startsWith('_') && !filename.includes('.test.')) {
          context.report({
            node,
            message: `Functions starting with underscore (${importedName}) can only be imported in test files`,
          })
        }
      },
    }
  },
}

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: {
      'underscore-imports': {
        rules: {
          'no-external': noUnderscoreImportsOutsideTests,
        },
      },
    },
    rules: {
      'underscore-imports/no-external': 'error',
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'underscore-imports/no-external': 'off',
    },
  },
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
)
