# Evolution chain

## Goal

See what a Pokémon evolves from and into, and tap through to those Pokémon, so I know its whole family.

## Constraints

- The Evolution tab on the detail screen, `src/app/pokemon/[id].tsx`.
- Two requests: `/pokemon-species/{id}` gives the URL of the chain, then `/evolution-chain/{chainId}` gives the chain. Through a service in `src/services/` and a hook in `src/hooks/`.
- The chain is a tree (one Pokémon can evolve into several). The service turns it into a simple list for the screen. The screen does not read the API format.
- Pokémon in the same family share one chain, so the hook caches it by chain id. Opening Pikachu after Pichu does not load the chain again.
- Follow the Figma "Detail – Evolution" screen: one card per Pokémon with the sprite, the number in a purple badge and the name, with dots between the cards.
- Colours and spacing from `src/constants/theme.ts`. No new dependencies.

## Acceptance Criteria

- [ ] Pikachu shows Pichu (#172), Pikachu (#025) and Raichu (#026), in that order.
- [ ] A Pokémon with branches shows all of them: Eevee first, then all 8 evolutions below it.
- [ ] The Pokémon I am looking at is highlighted with a purple border.
- [ ] Tapping another Pokémon in the chain opens its detail screen. "‹ Vorige" goes back to the one before.
- [ ] A Pokémon that does not evolve (for example Tauros) shows "This Pokémon does not evolve."
- [ ] The tab has its own spinner while loading, and its own error with "Try again". The About and Stats tabs keep working when the chain fails.

## Out of Scope

- How a Pokémon evolves (level, stone, trade).
- Mega evolutions and regional forms.
