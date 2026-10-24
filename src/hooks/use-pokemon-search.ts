import { useQuery } from '@tanstack/react-query';

import { getPokemonNames } from '@/services/pokemon';
import type { Pokemon } from '@/services/pokemon';

// Matches part of the name ("pika") or the exact number ("25")
export function filterPokemon(pokemon: Pokemon[], searchText: string): Pokemon[] {
  const query = searchText.trim().toLowerCase();

  if (!query) {
    return [];
  }

  const pokemonNumber = Number(query);
  const hasNumericQuery =
    /^\d+$/.test(query) && Number.isSafeInteger(pokemonNumber) && pokemonNumber > 0;

  return pokemon.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      (hasNumericQuery && item.id === pokemonNumber),
  );
}

// All names, so search also finds Pokémon that are not scrolled to yet
export function usePokemonSearch() {
  return useQuery({
    queryKey: ['pokemonSearch'],
    queryFn: getPokemonNames,
    // The list never changes, so it is loaded only once
    staleTime: Infinity,
  });
}
