# Pokédex

A Pokédex app on [PokeAPI](https://pokeapi.co/). Scroll through all Pokémon, search them, see their details and evolution chain, save favorites and compare two Pokémon. Design: the Figma "Pokémon Code Challenge" (phone screens), font Rubik.

**Stack:** Expo (Expo Go), Expo Router, TypeScript, TanStack Query, expo-sqlite.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. No `.env` or key needed: PokeAPI is public.

## Features

1. Pokémon list: 20 at a time while you scroll
2. Search: by name or number, also Pokémon not loaded yet
3. Pokémon detail: About, Stats and Evolution tabs
4. Evolution chain: tap through to every family member
5. Favorites: heart or ⋮ menu, saved in SQLite, Share in the ⋮ menu
6. Compare: two Pokémon side by side, who wins per stat

## Hand-in

| Part | Where |
|---|---|
| What the app is | [`specs/product.md`](specs/product.md) |
| One file per feature | [`specs/features/`](specs/features/) |
| Instructions for the agent | [`AGENTS.md`](AGENTS.md) |
| Issues with the agent's plan | [GitHub Issues](https://github.com/DenisaaMinu/pokedex-final/issues?q=is%3Aissue) #1 to #6 |
| Chats with the agent | [`chat-history/`](chat-history/) |
| The three questions | [`docs/explanation.md`](docs/explanation.md) |
