import { useQuery } from '@tanstack/react-query';

import { getPokemonDetail } from '@/services/pokemon';

export function usePokemon(id: number) {
  return useQuery({
    // Keep each Pokémon's detail response in its own cache entry.
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetail(id),
  });
}