import { useInfiniteQuery } from '@tanstack/react-query';

import { getPokemonPage } from '@/services/pokemon';

// Loads the list page by page, data.pages holds every loaded page
export function usePokemonList() {
  return useInfiniteQuery({
    // Own key, so it never clashes with the detail key ['pokemon', id]
    queryKey: ['pokemonList'],
    queryFn: ({ pageParam }) => getPokemonPage(pageParam),
    initialPageParam: 0,
    // undefined means there is no next page
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
}
