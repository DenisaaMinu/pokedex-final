# Favorites

## Goal

Save the Pokémon I like, see them together on their own tab, and share one with a friend. My favorites are still there the next time I open the app.

## Constraints

- Stored in SQLite on the phone, table `favorites` (`id`, `name`, `sprite_url`, `created_at`), through a service in `src/services/`. Replaces the old `bag` table and `bag-db.ts`.
- Read and changed through TanStack Query hooks in `src/hooks/`. All favorites query keys start with `['favorites', ...]`, so one invalidation refreshes the heart, the menu and the tab.
- Three places to add or remove a favorite:
  - the heart on the detail screen (outline when not a favorite, filled red when it is),
  - the ⋮ menu on every Pokémon card,
  - removing also from the ⋮ menu on the Favorites tab.
- The ⋮ menu is a sheet from the bottom like the Figma "Options" screen, built with React Native's `Modal`. No new dependencies.
- Share uses the `Share` API from `react-native` and sends text with the name and number only, so it needs no extra request. `Share.share` is wrapped in `try/catch`.
- The Favorites tab, `src/app/(tabs)/favorites.tsx`, follows the Figma "Favorites" screen: title "My favorites", the same cards as the list. It replaces the Bag tab.
- The tab bar in `src/components/app-tabs.tsx` follows the Figma: two tabs, "Pokémons" with the Pokéball icon and "Favorites" with the heart icon. The active tab's icon and label are Purple, the other one Midnight. The Pokéball icon is an image from the Figma in `assets/images/tabIcons/`, the heart can be a native symbol.
- The tab bar has a solid background so the cards do not show through it. If `NativeTabs` cannot be made solid on a platform (check the Expo docs for the SDK in `package.json`), at least make sure no card is hidden behind it.

## Acceptance Criteria

- [ ] Tapping the heart on the detail screen adds the Pokémon, tapping again removes it. The heart is filled red when it is a favorite.
- [ ] The ⋮ menu shows "Open Pokémon", "Add to favorites" (or "Remove from favorites" when it already is one), "Share" and "Cancel".
- [ ] "Open Pokémon" opens the detail screen. "Cancel" or tapping outside closes the menu.
- [ ] "Share" opens the share sheet with "Check out Pikachu (#025) in my Pokédex!". Cancelling just closes it. If it fails, an alert shows.
- [ ] The Favorites tab shows my favorites, newest first. Tapping one opens its detail screen.
- [ ] Adding or removing updates the heart, the menu and the Favorites tab at once, without a reload.
- [ ] With no favorites, the tab shows "No favorites yet. Tap the heart on a Pokémon to save it."
- [ ] After killing the app and opening it again, my favorites are still there.
- [ ] The Favorites tab has a loading state and an error state.
- [ ] The tab bar looks like the Figma: Pokéball and "Pokémons", heart and "Favorites", the active one in Purple.
- [ ] No card is hidden behind the tab bar, also not the last row when I scroll to the bottom of the list or of my favorites.

## Out of Scope

- Sorting or searching inside favorites.
- Notes or tags on a favorite.
- Syncing favorites between phones.
