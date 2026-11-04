import { useQuery } from '@tanstack/react-query';

import { getPokemonEvolutionChain, getPokemonSpecies } from '@/services/pokemon';

export function usePokemonSpecies(id: number, speciesUrl: string) {
  return useQuery({
    queryKey: ['pokemonSpecies', id],
    queryFn: () => getPokemonSpecies(speciesUrl),
  });
}

export function useEvolutionChain(chainId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['evolutionChain', chainId],
    queryFn: () => {
      if (chainId === undefined) {
        throw new Error('Unable to load the evolution chain: the number is missing.');
      }

      return getPokemonEvolutionChain(chainId);
    },
    enabled: enabled && chainId !== undefined,
  });
}