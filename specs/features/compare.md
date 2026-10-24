# Compare

## Goal

Put two Pokémon side by side and see who is stronger on which stat, so I can decide which one to use.

## Constraints

- Starts from a "Compare" button on the detail screen, `src/app/pokemon/[id].tsx`. The Pokémon I am looking at is the first one.
- Then I pick the second Pokémon on a screen with a search bar. It reuses the names list and filtering from [search](./search.md).
- The compare screen `src/app/compare.tsx` gets both ids from the route. The stats come from the same hook and cache as the detail screen (`['pokemon', id]`), so a Pokémon I opened before needs no new request.
- The Figma has no screen for this. Follow its style: the cards, Midnight text, Purple `#5631E8` bars and Silver `#DBDAE6` for the weaker side, Rubik font.
- The logic (who wins each stat, the total) is in a function outside the screen, so it can be tested.
- Colours and spacing from `src/constants/theme.ts`. No new dependencies.

## Acceptance Criteria

- [ ] The detail screen has a "Compare" button. Tapping it opens a screen to pick the second Pokémon, with a search bar.
- [ ] The compare screen shows both Pokémon at the top: sprite, name and number.
- [ ] Per stat (HP, Attack, Defense, Special Attack, Special Defense, Speed) both values with a bar. The stronger one is purple, the weaker one grey. A tie: both purple.
- [ ] At the bottom a total: "Charizard wins 4 of 6 stats", or "It's a draw".
- [ ] I can compare any two Pokémon, also two of the same.
- [ ] Each Pokémon has its own loading state and error with "Try again".

## Out of Scope

- Comparing more than two Pokémon.
- Types, weaknesses or a battle result.
- Saving comparisons.
