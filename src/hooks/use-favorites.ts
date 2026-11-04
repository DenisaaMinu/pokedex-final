import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import {
    addFavorite,
    getFavorites,
    isFavorite,
    removeFavorite,
} from '@/services/favorites-db';
import type { Pokemon } from '@/services/pokemon';

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });
}

export function useIsFavorite(id: number) {
  return useQuery({
    queryKey: ['favorites', id],
    queryFn: () => isFavorite(id),
    enabled: id > 0,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pokemon: Pokemon) => addFavorite(pokemon),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: (error) => {
      Alert.alert(
        'Unable to save favorite',
        error instanceof Error ? error.message : 'Please try again.'
      );
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => removeFavorite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: (error) => {
      Alert.alert(
        'Unable to remove favorite',
        error instanceof Error ? error.message : 'Please try again.'
      );
    },
  });
}