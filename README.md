# Productive Hub

Productive Hub is a React task workspace backed by a local Node API and SQLite database.

## Development

Install dependencies:

```bash
pnpm install
```

Start the API in one terminal:

```bash
pnpm dev:api
```

Start the frontend in another terminal:

```bash
pnpm dev
```

The API runs on `http://127.0.0.1:3000` and the Vite frontend uses `VITE_API_URL` from `.env` when provided. Copy `.env.example` to `.env` to configure it explicitly.

SQLite creates `../backend/data/productive-hub.sqlite` on first API start. The database starts empty: users and tasks appear only after someone signs in and adds them.

The demo password is `password123`. Authentication is intentionally development-only until a real identity provider is added.

## Checks

```bash
pnpm test
pnpm build
```

## Architecture

- `src/` contains the React frontend.
- `../backend/src/server.js` exposes auth and task endpoints.
- `../backend/src/db.js` owns SQLite initialization and persistence.
- `src/shared/api/http.ts` is the frontend API client.

---

The remainder of this file is the original Vite template reference.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            // Other configs...

            // Remove tseslint.configs.recommended and replace with this
            ...tseslint.configs.recommendedTypeChecked,
            // Alternatively, use this for stricter rules
            ...tseslint.configs.strictTypeChecked,
            // Optionally, add this for stylistic rules
            ...tseslint.configs.stylisticTypeChecked,

            // Other configs...
        ],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            // Other configs...
            // Enable lint rules for React
            reactX.configs['recommended-typescript'],
            // Enable lint rules for React DOM
            reactDom.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
]);
```
