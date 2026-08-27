import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    // react-three-fiber renders <mesh>/<boxGeometry>/... intrinsics with
    // three.js prop names (args, position, intensity, attach, ...) that
    // aren't real DOM attributes, and the loom's animation deliberately
    // mutates imperative three.js objects (camera, instanced mesh
    // matrices/colors) inside useFrame every tick — that's the standard,
    // required R3F pattern, not a React-purity violation. Both
    // react/no-unknown-property and the compiler-oriented
    // react-hooks/immutability rule assume plain DOM/React semantics that
    // don't apply to this directory.
    files: ['src/three/**/*.{js,jsx}'],
    rules: {
      'react/no-unknown-property': 'off',
      'react-hooks/immutability': 'off',
    },
  },
])
