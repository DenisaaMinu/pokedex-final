# Pokémon detail

## Goal

Tap a Pokémon to see who it is and how strong it is: its types, its info and its stats.

## Constraints

- A detail screen `src/app/pokemon/[id].tsx`, reachable from the list, from search results and from favorites. Replaces the old item detail screen.
- Data from PokeAPI `/pokemon/{id}`, through a service in `src/services/` and a hook with query key `['pokemon', id]`.
- Follow the Figma "Detail" screens: a light blue top part with "‹ Vorige", the heart, the name, the number and the types, then the big artwork, then the tabs.
- Artwork from `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`.
- Every type has its own colour, the official colours from the games, for all 18 types. They live in `src/constants/theme.ts`, not in the component.
- PokeAPI gives weight in hectograms and height in decimetres. The service turns them into kg and m.
- Switching tabs is by tapping. No new dependencies.

## Acceptance Criteria

- [ ] The top shows "‹ Vorige" (goes back), a heart, the name, the number in grey (`#001`) and a chip per type with a dot in the type colour.
- [ ] Below that the official artwork, large.
- [ ] Three tabs: About, Stats, Evolution. The active tab is underlined in purple. Tapping a tab switches at once, without loading again.
- [ ] About shows Name, ID, Base (XP), Weight (kg), Height (m), Types and Abilities (not the hidden ability, like the Figma). Bulbasaur: 64 XP, 6.9 kg, 0.7 m, Grass, Poison, Overgrow.
- [ ] Stats shows HP, Attack, Defense, Special Attack, Special Defense and Speed, each with its number and a purple bar. The bar length is the value compared to the maximum (255).
- [ ] The header title and the name use capitals: "Bulbasaur", ability "Solar Power", not "solar-power".
- [ ] While loading a spinner, and an unknown id (for example `/pokemon/99999`) shows an error with "Try again", not a crash.
- [ ] Opening the same Pokémon a second time is instant (cache).

## Out of Scope

- What the heart does: that is in [favorites](./favorites.md).
- The Evolution tab: that is in [evolution](./evolution.md).
- Moves, locations, Pokédex text or cries.
- Swiping between tabs.
