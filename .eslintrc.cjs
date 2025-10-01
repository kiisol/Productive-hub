/* eslint-env node */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "eslint-config-prettier"
    ],
    settings: { react: { version: "detect" } },
    rules: {
        "react/react-in-jsx-scope": "off",
        "import/order": ["warn",
            { "newlines-between": "always",
                alphabetize: { order: "asc", caseInsensitive: true },
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                pathGroups: [
                    { pattern: '@{app,shared,entities,features,pages,widgets}/**', group: 'internal', position: 'before' },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
            }],
        "@typescript-eslint/consistent-type-imports": "warn"
    }
};
