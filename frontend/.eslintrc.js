module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'testing-library',
    'jest-dom',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: '19.1.0',
    },
  },
  rules: {
    // TypeScript Rules (only enable rules that exist)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-var-requires': 'error',

    // General JavaScript Rules
    'prefer-const': 'off', // Handled by TypeScript ESLint
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'no-duplicate-imports': 'error',

    // React 19 Specific Rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 19
    'react/prop-types': 'off', // Using TypeScript
    'react/display-name': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'off', // Not needed in React 19
    'react/jsx-uses-vars': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-children-prop': 'error',
    'react/no-danger': 'warn',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    'react/self-closing-comp': 'error',
    'react/sort-comp': 'off', // Using functional components
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-spacing': ['error', 'never'],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-max-props-per-line': ['error', { maximum: 3 }],
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-props-no-multi-spaces': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-wrap-multilines': 'error',

    // React Hooks Rules (React 19 Compatible)
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility Rules (WCAG 2.1 AA Compliance)
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': ['error', { aspects: ['invalidHref'] }],
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/autocomplete-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/control-has-associated-label': 'warn',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',

    // Next.js Specific Rules
    '@next/next/no-img-element': 'error',
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-sync-scripts': 'error',
    '@next/next/no-unwanted-polyfillio': 'error',
    '@next/next/no-css-tags': 'error',
    '@next/next/no-head-element': 'error',
    '@next/next/no-head-import-in-document': 'error',
    '@next/next/no-script-component-in-head': 'error',
    '@next/next/no-styled-jsx-in-document': 'error',
    '@next/next/no-title-in-document-head': 'error',
    '@next/next/no-document-import-in-page': 'error',
    '@next/next/no-duplicate-head': 'error',

    // Performance and SEO Rules
    '@next/next/google-font-display': 'warn',
    '@next/next/google-font-preconnect': 'warn',
    '@next/next/next-script-for-ga': 'warn',
    '@next/next/no-before-interactive-script-outside-document': 'error',
    '@next/next/no-page-custom-font': 'warn',

    // Testing Library Rules
    'testing-library/await-async-queries': 'error',
    'testing-library/await-async-utils': 'error',
    'testing-library/no-await-sync-queries': 'error',
    'testing-library/no-container': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': ['error', 'react'],
    'testing-library/no-node-access': 'error',
    'testing-library/no-promise-in-fire-event': 'error',
    'testing-library/no-render-in-lifecycle': 'error',
    'testing-library/no-unnecessary-act': 'error',
    'testing-library/no-wait-for-multiple-assertions': 'error',
    'testing-library/no-wait-for-side-effects': 'error',
    'testing-library/no-wait-for-snapshot': 'error',
    'testing-library/prefer-find-by': 'error',
    'testing-library/prefer-presence-queries': 'error',
    'testing-library/prefer-query-by-disappearance': 'error',
    'testing-library/prefer-screen-queries': 'error',
    'testing-library/render-result-naming-convention': 'error',

    // Jest DOM Rules
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-focus': 'error',
    'jest-dom/prefer-in-document': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
    'jest-dom/prefer-to-have-class': 'error',
    'jest-dom/prefer-to-have-text-content': 'error',
    'jest-dom/prefer-to-have-value': 'error',
  },
  overrides: [
    // Configuration for test files
    {
      files: ['**/__tests__/**/*', '**/*.{test,spec}.*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'testing-library/no-debugging-utils': 'off',
      },
    },
    // Configuration for E2E test files
    {
      files: ['**/tests/e2e/**/*', '**/*.e2e.*'],
      rules: {
        'testing-library/prefer-screen-queries': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // Configuration for configuration files
    {
      files: ['*.config.{js,ts}', '*.setup.{js,ts}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
      },
    },
    // Configuration for Next.js App Router
    {
      files: ['**/app/**/*', '**/src/app/**/*'],
      rules: {
        '@next/next/no-head-element': 'off', // Allow head in app directory
        'react/jsx-no-leaked-render': 'off', // Server components can return null
      },
    },
    // Configuration for API routes
    {
      files: ['**/api/**/*', '**/src/api/**/*'],
      rules: {
        'no-console': 'off', // Allow console in API routes for logging
        '@typescript-eslint/no-explicit-any': 'warn', // More lenient for API types
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    '*.config.js',
    'coverage/',
    '.eslintrc.js',
  ],
};
