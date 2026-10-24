# Search

## Goal

Find any Pokémon by typing its name or number, also one I have not scrolled to yet, so I do not have to scroll through 1300 Pokémon.

## Constraints

- The search bar is at the top of the Pokémons tab, `src/app/(tabs)/index.tsx`, like the Figma "Home" and "Search" screens. Placeholder "Search for Pokémon..".
- PokeAPI has no search endpoint. Load the names and numbers of all Pokémon once with `/pokemon?limit=2000` (one small request) and filter that list in the app. No request per letter.
- That names list is cached with TanStack Query, so it is not loaded again every time.
- The results use the same cards as the list (number, sprite, name, ⋮).
- While searching, the list does not load more pages (rule in `AGENTS.md`).
- Colours and spacing from `src/constants/theme.ts`.
- No new dependencies.

## Acceptance Criteria

- [ ] Typing filters while I type, on names that **contain** the text, not case sensitive: "ch" shows Charmander, Charmeleon, Charizard and Pikachu.
- [ ] Typing a number finds that Pokémon: "25" and "025" both show Pikachu.
- [ ] A Pokémon that is not loaded in the list yet is found too, for example "mew" (#151) right after opening the app.
- [ ] No match shows the text "No Pokémon found".
- [ ] Clearing the search bar shows the normal list again, where I was.
- [ ] Tapping a result opens its detail screen.
- [ ] While the names list loads, the list still works. If loading it fails, searching shows an error with "Try again".

## Out of Scope

- Search by type, ability or stat.
- Search history or suggestions.
- Search on the Favorites tab.
