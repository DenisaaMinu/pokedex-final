import { useInfiniteQuery } from '@tanstack/react-query';

import { getPokemonPage } from '@/services/pokemon';

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemonList'],
    queryFn: ({ pageParam }) => getPokemonPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
}
