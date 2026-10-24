# Pokédex

A Pokédex app on PokeAPI. You can scroll through all Pokémon, search them, see their details and evolutions, save favorites and compare two Pokémon.

**Stack:** Expo (runs in Expo Go), Expo Router, TypeScript, TanStack Query, expo-sqlite

**What to build:** read `specs/product.md` and the feature file in `specs/features/` for the issue I give you. The design is the Figma "Pokémon Code Challenge" (phone screens only). The font is Rubik.

**Setup from my course app** (reuse it, do not build it again):

- Query provider: one `QueryClient` in `src/app/_layout.tsx`.
- Fonts: Rubik from `assets/fonts/`, loaded with `useFonts` in `src/app/_layout.tsx`. Names in `RubikFonts` in `src/constants/theme.ts`.
- Theme: colours (light and dark), `Spacing`, `Radius` and the 18 type colours in `src/constants/theme.ts`. Use them with `useTheme()`.
- Shared UI: `ThemedText`, `ThemedView`, `ErrorView` in `src/components/`.
- Tabs: `src/components/app-tabs.tsx` with `NativeTabs`.
- Database: `expo-sqlite` is installed. The favorites feature creates its table in `src/services/`.
- The Pokémons tab is a placeholder until the first issue replaces it.

## Folders

```
src/app/          # screens, Expo Router routes
src/components/   # reusable UI
src/hooks/        # data hooks, shared logic
src/services/     # API calls and SQLite
```

A screen renders, a hook gets data, a service talks to the API or the database. Nothing does two of those.

## How we work

- One issue per chat.
- First a plan, no code. Post it as a comment on the issue with `gh issue comment <number>`, with a `- [ ]` task list. Wait until I say "go".
- While building, tick off the tasks on the issue.
- On Windows, post or edit issue comments with `--body-file` and a UTF-8 file. Not with `--body "...\n..."` (the `\n` stays as text) and not with a PowerShell pipe (it turns `é` into `?`).
- I do the commits myself. Do not commit or push.

## Rules

- Follow the folder list above. Data flow: screen → hook → service.
- Screens never call `fetch` or SQLite themselves.
- Colours, spacing and radius only from `src/constants/theme.ts` (`useTheme()`, `Spacing`, `Radius`), never hex codes or numbers like `borderRadius: 8` directly in a component.
- Every screen needs a **loading** state and an **error** state (and an **empty** state, `data.length === 0`, when a list can be empty).
- Hooks return `useQuery` / `useMutation` directly, so TypeScript knows `data` exists after the loading and error checks.
- Query keys for favorites must start with `['favorites', ...]`, because invalidating `['favorites']` refreshes every key that starts with `'favorites'`.
- No `any`, no `as` casts (only `as const` is fine), no `@ts-ignore`.
- Imports use `@/` instead of relative paths like `../../hooks/...`.
- Install packages with `npx expo install`.
- Keep changes **small**, don't touch files you weren't meant to touch.
- Work in my current workspace, not in a separate worktree. If you can't find something I mention, ask me instead of assuming it doesn't exist.
- Every async call (like `Share.share`) needs a `try/catch` that shows the user an error.
- Run `npx tsc --noEmit` and `npx expo lint` after every change and fix the errors before you say you're done.
- Do every step of your plan. Before you say you're done, check that every file in the plan was really changed.
- Follow the Constraints, Acceptance Criteria and Out of Scope of the feature file. Do not build what is out of scope.
- Check the Figma screen for every component you build: layout, colours, sizes and where each element sits. New colours go in `theme.ts` with a light and a dark value.
- New route files: `tsc` only knows them after `npx expo start` has run once. Do not change working code to fix that error.
- Lists that load more while scrolling: only load the next page when there is one and none is loading yet, and never while a search is active.
- Never add a package without asking me first, also not for fonts.
- Never force-push. My git history is part of my hand-in.

---

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
