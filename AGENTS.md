# Productive Hub — Agent Instructions

## Scope and context

- These instructions apply to the entire repository, including CSS and React components.
- Also follow `../../AGENTS.md` (`/Volumes/T7/WorkProjects/AGENTS.md`); this file takes precedence for project-specific guidance.
- Before editing, read this file, `README.md`, and the relevant existing feature and styles.
- Stack: React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4, React Hook Form, Zod, Vitest. Use pnpm.
- Structure: `src/app`, `src/pages`, `src/features`, `src/shared`. Keep pages thin and hooks in individual files.
- Authentication is a development flow; the Node API issues in-memory demo sessions and stores users and tasks in SQLite. There is no production identity provider yet.
- Code, comments, documentation, and product UI are in English. User-facing copy must go through the shared i18n module.

## Visual direction

- Preserve the calm light interface, graphite text, purple accent, subtle borders, and clear typography.
- Keep Tasks, My Day, login, and shared components visually consistent.
- Support narrow screens, visible keyboard focus, accessible labels, and reduced motion.

## Design tokens — required for all UI changes

- Use a single shared token system for colors, typography, spacing, radii, borders, shadows, and motion.
- The current token source is the `:root` block in `src/index.css`. Read it before adding or changing styles.
- Reuse existing tokens. Add a named shared token when no suitable token exists; do not define duplicate component palettes.
- Raw theme values belong only in token definitions, never in component selectors, JSX styles, SVG attributes, or Tailwind arbitrary values.
- Prefer semantic color names, such as `--color-text-secondary`, `--color-surface`, and `--color-accent-hover`, over names tied to a specific component.
- Define reusable scales for spacing, font sizes, radii, and motion. Reference them with `var(...)` in component styles.
- Include hover, focus, disabled, error, priority, and empty states in the token system.
- Tailwind utilities are acceptable when backed by the shared tokens; do not mix an independent Tailwind color palette with custom theme colors.
- Structural values such as `0`, `100%`, `auto`, grid fractions, and documented responsive breakpoints may remain literal.
- Example: `color: var(--color-text-secondary); padding: var(--space-3); border-radius: var(--radius-md);`.

## Current styling debt

- Tokenization is incomplete: `src/index.css` still has literal colors, spacing, font sizes, and shadows; existing shared UI also uses Tailwind palette utilities.
- Existing tokens include `--accent`, `--ink`, `--muted`, `--line`, `--surface`, `--lavender`, `--space`, and `--radius`. `--space` is currently unused.
- Existing hardcoded values are debt, not a pattern to copy. When changing a component, migrate its touched styles to shared tokens while preserving appearance.
- A full token migration has not been completed. Do not claim otherwise without checking CSS, JSX, and shared UI.

## Verification and changes

- After UI changes, check TypeScript and production build; inspect affected screens in the browser at desktop and narrow widths when available.
- Run relevant existing tests for behavior changes. Do not add tests that merely repeat CSS declarations.
- Use Prettier for formatting. The project standard is `tabWidth: 4` with four spaces per indentation level (`useTabs: false`), single quotes, semicolons, a 100-character line width, and trailing commas.
- Do not hand-format around Prettier; run `pnpm format` or target Prettier at the changed files.
- Keep primary actions visually light and intentional: use the shared accent tokens, a compact height, a soft shadow, and a clear icon treatment. Avoid oversized solid blocks or new one-off button colors.
- Keep styling refactors separate from unrelated behavior changes.
- Do not commit or push unless requested. Never commit secrets or `.env` files.

## Project map and development commands

- `src/main.tsx`: React entry point and AuthProvider; `src/App.tsx`: AppRouter composition.
- `src/app`: routes, route guards, shared sidebar layout, and error boundary.
- `src/pages`: login, tasks, dashboard (My Day), and 404. HomePage is an unused prototype.
- `src/features/auth`: demo service, session context/provider, useAuth, and validated login form.
- `src/features/tasks`: task model, API service, useTasks hook, TaskWorkspace, and NewTaskDialog. There are no seed examples.
- `src/shared/ui`: reusable UI primitives; `src/shared/api/http.ts`: fetch wrapper with token, retries, and timeout.
- Reusable screen composition lives in `src/shared/ui/ScreenLayout.tsx`, `ScreenHeader`, `StatCard`, and `PanelHeader`. New screens should compose these primitives and pass content through props rather than duplicating layout markup.
- `src/shared/i18n`: translation keys and the `t`/`useTranslation` helpers. Add user-facing copy there instead of embedding strings in components.
- `../backend/src/server.js`: HTTP server and route composition for the local Node API. The backend is a sibling project at `/Volumes/T7/WorkProjects/ProductiveHub/backend` and stores SQLite data in its own `data` directory.
- `../backend/src/services`: authentication and task business services used by the server.
- `../backend/src/db.js`: SQLite WASM initialization and persistence for users and tasks. The frontend and backend are separate pnpm projects with their own dependency manifests.
- `src/shared/lib`: number, object, and string helpers with existing Vitest tests.
- `src/index.css`: global styles and current shared tokens. Path aliases are configured in Vite and TypeScript.
- Install: `pnpm install`. Start: `pnpm dev`. Use the URL printed by Vite; ports can change when occupied.
- Start the API in a second terminal with `pnpm dev:api`; the script runs the sibling `../backend` project on `http://127.0.0.1:3000`. The frontend defaults to this API and can override it with `VITE_API_URL`.
- Build: `pnpm build`. Tests: `pnpm test`. Lint: `pnpm lint`.
- Type check without emitted artifacts: `pnpm exec tsc -p tsconfig.app.json --noEmit --composite false --incremental false`.
- Target formatting to changed files rather than running the repository-wide format command for a small edit.
- Do not leave generated JavaScript, declarations, or build metadata in source folders. The node TypeScript project currently lacks `noEmit`; check generated artifacts after a full build.
- Use the existing pnpm lockfile for the frontend; the sibling backend keeps its own `pnpm-lock.yaml`. Do not introduce another package-manager lockfile in either project. Ignore macOS `._*` files.

## Current implementation and continuation (2026-09-18)

- Implemented a light purple-accent interface for Tasks, My Day, and login, with responsive CSS.
- Tasks support creating with a priority, completing, deleting, searching, and filtering by completion.
- Task data is loaded from `GET /api/tasks` and changed through the Node API; there are no seed tasks or frontend fallback records.
- The backend lives outside this repository at `/Volumes/T7/WorkProjects/ProductiveHub/backend`; `pnpm dev:api` starts that sibling project.
- SQLite data is persisted at `/Volumes/T7/WorkProjects/ProductiveHub/backend/data/productive-hub.sqlite`; the database is created empty and grows through sign-in and task actions.
- Tasks are currently browser-wide, not isolated by signed-in user; changing a demo account does not create a separate task workspace.
- My Day reuses TaskWorkspace and shows incomplete tasks; there are no due dates or actual date-based selection yet.
- Users can register with a name, email, and password; login validates the stored password hash. Existing legacy demo users can still use `password123` once and are upgraded to a hash.
- Session keys are `auth_token` and `auth_user`.
- HTTP configuration uses `VITE_API_URL`; login and task operations call the local Node API.
- Editing tasks, project management, backend sync, real authentication, and full token migration are not implemented.
- English is the current product language. Additional languages should be added as translation dictionaries without moving copy back into components.
- Last checks in this session: frontend TypeScript check and Vite production build passed; 7 existing helper tests passed. Browser checks covered demo login, completion filter, and opening/cancelling the creation dialog.
- Backend move verification: `../backend` runs on port 3000, `/api/health` reports SQLite, and the frontend repository no longer contains a `backend` directory.
- Narrow-screen layout and task creation/deletion persistence were not verified end to end in the browser; do not infer coverage from the existing helper tests.
- Next styling work: finish migrating global and shared component styles to tokens while preserving the approved visual direction. New screens should start from the reusable screen primitives before adding page-specific sections.

## Keep this context current

- At the end of a task, update the relevant sections here when the stack, architecture, commands, storage contracts, UI rules, implemented behavior, or outstanding limitations change.
- Record important user-approved decisions and the current continuation point so a future session can resume without relying on chat history.
- Replace outdated statements rather than accumulating contradictory entries. Keep this file concise; it is project guidance, not a transcript of every edit.
- Clearly separate implemented behavior, proposed work, and verified results. Include material verification gaps.
- Never record credentials, tokens, personal task contents, private account information, or environment secrets.
- Updating this file is part of completing relevant project changes; it does not require a separate request from the user.
