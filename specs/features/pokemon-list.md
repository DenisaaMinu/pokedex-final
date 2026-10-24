# Pokémon list

## Goal

See all Pokémon in a grid when I open the app, so I can scroll through them and pick one to look at.

## Constraints

- Lives on the first tab, `src/app/(tabs)/index.tsx`, called "Pokémons" in the tab bar. Replaces the old item list.
- Data from PokeAPI `/pokemon?limit=20&offset=...`, page by page with `useInfiniteQuery`, through a service in `src/services/` and a hook in `src/hooks/`.
- The list endpoint only gives a name and a URL. The number comes from the URL, the sprite is built from the number: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`. No extra request per card.
- Follow the Figma "Home" screen: title "All Pokémon", 2 cards per row, colours Midnight `#0E0940` and Purple `#5631E8` from `src/constants/theme.ts`.
- Reuse what I have: the layers, the pagination guard from `AGENTS.md`, `ErrorView`.
- No new dependencies.

## Acceptance Criteria

- [ ] The Pokémons tab shows the title "All Pokémon" and a grid of cards, 2 per row.
- [ ] Every card shows the number in a purple badge (`001`), the sprite, the name and a ⋮ button.
- [ ] The names start with a capital letter: "Bulbasaur", not "bulbasaur".
- [ ] The first 20 load at start. Scrolling to the bottom loads the next 20, with a small spinner.
- [ ] Tapping a card opens the detail screen of that Pokémon.
- [ ] The first load shows a spinner, and a failed load shows an error with "Try again".
- [ ] Scrolling stays smooth, also after loading a few hundred Pokémon.

## Out of Scope

- Types on the cards (needs an extra request per Pokémon).
- What the ⋮ menu does: that is in [favorites](./favorites.md).
- Search: that is in [search](./search.md).
- Sorting or filtering by type.
