import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint, { parser } from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: {
            globals: globals.browser,
            parser,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            tseslint: tseslint.plugin,
            prettier: prettier,
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    eslintConfigPrettier,
    {
        ignores: ['node_modules', 'dist', 'build', '/*.js'],
    },
];
