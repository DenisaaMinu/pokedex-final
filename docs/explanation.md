# Explanation - Pokédex

**Route:** Pokédex. **Tools:** GitHub Copilot agent in VS Code (builds every issue), Claude Code in a second chat (reviews the plan and the diff before I say go or commit).

## 1. My technical choices

**Stored in SQLite: my favorite Pokémon.** The database is opened once in `src/services/favorites-db.ts:11` and the `favorites` table (`id`, `name`, `sprite_url`, `created_at`) is created at `src/services/favorites-db.ts:14`. I picked SQLite over AsyncStorage because it is a real table: the Favorites tab gets them newest first with `ORDER BY created_at DESC` (`src/services/favorites-db.ts:24`), and `INSERT OR IGNORE` (`src/services/favorites-db.ts:43`) means the same Pokémon can never be saved twice, without reading and rewriting a whole list. The screens never touch SQLite: they go through the hooks in `src/hooks/use-favorites.ts`, and every key starts with `'favorites'` (`src/hooks/use-favorites.ts:14` and `:21`), so one invalidation after adding or removing (`src/hooks/use-favorites.ts:32`) updates the heart, the ⋮ menu and the Favorites tab at once. The Pokémon data itself is not in SQLite, because it comes from the API and TanStack Query already caches it.

What changed while building: the heart on the detail screen first saved the big official artwork as `sprite_url`. Now it saves the same small sprite as the list (`src/app/pokemon/[id].tsx:36`), so a favorite looks the same everywhere.

**Native feature: Share.** It sits in the ⋮ menu on every Pokémon card, like the Figma "Options" screen: `Share.share` in `src/components/pokemon-options-sheet.tsx:37`. It sends only text, "Check out Pikachu (#025) in my Pokédex!" (`src/components/pokemon-options-sheet.tsx:38`), so it works in every chat app and needs no extra request. It is wrapped in `try/catch` and shows an alert if it fails. The alternative was haptics when adding a favorite, but Share is in the design and more useful. This choice did not change.

## 2. One feature from API call to screen: Pokémon detail

1. **Screen.** `src/app/pokemon/[id].tsx` reads the id from the route and calls `usePokemon(Number(idParam))` (`src/app/pokemon/[id].tsx:23`). It never calls `fetch` itself.
2. **Hook.** `usePokemon` in `src/hooks/use-pokemon.ts` returns `useQuery` with the key `['pokemon', id]` (`src/hooks/use-pokemon.ts:8`). The one `QueryClient` from `src/app/_layout.tsx:11` caches it per Pokémon, so opening the same Pokémon again is instant. The compare screen uses the same hook and key, so a Pokémon I already opened is not loaded again there.
3. **Service.** `getPokemonDetail` (`src/services/pokemon.ts:344`) calls `/pokemon/{id}`. Instead of an `as` cast, the type guard `isPokemonDetailResponse` (`src/services/pokemon.ts:191`) checks the shape. It also allows `base_experience` to be `null`, because some Pokémon have none. Then `toPokemonDetail` (`src/services/pokemon.ts:276`) turns it into our own shape once: hectograms and decimetres into kg and m (`src/services/pokemon.ts:286-287`), the hidden ability left out (`src/services/pokemon.ts:293`), and names with capitals ("Solar Power").
4. **Loading and error.** While loading, the screen shows a spinner (`src/app/pokemon/[id].tsx:44`). If the request fails, for example `/pokemon/99999`, it shows `ErrorView` with "Try again", which calls `refetch` (`src/app/pokemon/[id].tsx:50`).
5. **On screen.** Then the data is shown as it comes: the About tab (`src/app/pokemon/[id].tsx:118`) and one `PokemonStatRow` per stat, with the bar scaled to 255 (`src/app/pokemon/[id].tsx:122`). The Evolution tab has its own two queries, so About and Stats keep working when the chain fails.

## 3. A suggestion from the agent that I rejected or changed

In issue #5 (Favorites) the agent said the Pokémons tab had a Pokéball icon, "reusing the existing Pokéball image `home.png`". When I reviewed the diff, I opened that image: it is a house from the Expo template, not a Pokéball. My spec says "Pokéball and Pokémons". I replaced it with a Pokéball icon, `assets/images/tabIcons/pokeball.png` (`src/components/app-tabs.tsx:22`). In the same review I saw that the heart saved the big artwork instead of the sprite, and had that changed too (`src/app/pokemon/[id].tsx:36`). Both became rules in `AGENTS.md`: open an image before reusing it, and save the same fields the list uses. Chat: `chat-history/issue-5.json`. Commit: "Favorites (closes #5)".

Two smaller ones:

- **#4 Evolution.** The agent put the chain in one horizontal row that scrolls sideways. My spec says Eevee first and "all 8 evolutions below it", so I changed it to one vertical column (`src/components/pokemon-evolution.tsx`). Chat: `chat-history/issue-4.json`.
- **#3 Detail.** The agent's type guard required `base_experience` to be a number. PokeAPI sends `null` for some Pokémon, so those would show an error screen even though the request worked. I had it accept `null` (`src/services/pokemon.ts:198`), and About shows "–". Chat: `chat-history/issue-3.json`.
