# Pokédex

A Pokémon app for people who play the game, like the game or collect cards. They can look up any Pokémon and see its details, save their favorites and compare two Pokémon.

## Core action

Look up a Pokémon and see its details: types, stats and abilities.

## Features

1. [Pokémon list](./features/pokemon-list.md): all Pokémon in a grid of cards with number, sprite and name, 20 at a time while I scroll.
2. [Search](./features/search.md): type a name and find any Pokémon, also one that is not loaded yet.
3. [Pokémon detail](./features/pokemon-detail.md): name, number, artwork, types in their colour, and the tabs About and Stats.
4. [Evolution chain](./features/evolution.md): the Evolution tab shows every step, and I can tap through to that Pokémon.
5. [Favorites](./features/favorites.md): save a Pokémon with the heart or the ⋮ menu, see them on their own tab, still there after a restart. The ⋮ menu also has Share.
6. [Compare](./features/compare.md): put two Pokémon side by side and see who is stronger per stat.

## Data

- **API**: [PokeAPI](https://pokeapi.co/docs/v2). Public, no login, no key.
- **Endpoints**:
  - `/pokemon?limit=20&offset=...`: the list, page by page.
  - `/pokemon?limit=2000`: only the names and numbers of all Pokémon, for search.
  - `/pokemon/{id}`: detail (types, stats, abilities, height, weight, base XP).
  - `/pokemon-species/{id}` → `/evolution-chain/{id}`: the evolution chain.
  - Sprites and artwork from the PokeAPI sprites repo, built from the number.
- **Stored on the phone**: table `favorites` in SQLite: `id`, `name`, `sprite_url`, `created_at`.

## Technical choices

- **Stored in SQLite**: my favorite Pokémon. Not the Pokémon data itself, because that comes from the API and TanStack Query already caches it. SQLite and not AsyncStorage, because SQLite is a real table: I can sort favorites by date added and check if a Pokémon is already saved, without reading and rewriting the whole list.
- **Native feature**: Share, in the ⋮ menu on each Pokémon card, like the Figma. It sends text with the name and number, not a picture, so it works in every chat app. Not the types: the card only knows the name and number, and loading the types first would mean an extra request that can fail. Alternative: haptics, a small vibration when I add a favorite, but Share is in the design and more useful.

## Technical core

- [ ] Runs in Expo Go
- [ ] Live data through TanStack Query
- [ ] At least 2 screens with Expo Router
- [ ] Something in SQLite that survives a restart
- [ ] Loading and error state on every load
- [ ] One native feature: Share, in the ⋮ menu on each Pokémon card
- [ ] TypeScript and ESLint without errors
- [ ] UI, data and logic in separate files

## Optional

- [ ] Pagination: page by page while you scroll, not all at once
- [ ] Clean TypeScript: no `any`, no `as` casts, no `@ts-ignore`
- [ ] Design: pixel perfect to the Figma
- [ ] Dark mode: every screen looks right, all colours from the theme

## Out of scope

- Pokémon items, moves or locations.
- Battles.
- Accounts or syncing between phones.
- The desktop and tablet screens from the Figma.
- A web version.
