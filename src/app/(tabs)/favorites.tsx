import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorView from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { data, error, isError, isPending, refetch } = useFavorites();

  function openPokemon(pokemon: Pokemon) {
    router.push({
      pathname: '/pokemon/[id]',
      params: { id: String(pokemon.id), name: pokemon.name },
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: theme.midnight }]}>My favorites</ThemedText>
      </View>
      {isPending ? (
        <View style={styles.state}>
          <ActivityIndicator color={theme.purple} size="large" />
        </View>
      ) : isError && !data ? (
        <View style={styles.state}>
          <ErrorView
            message={error instanceof Error ? error.message : 'Unable to load favorites.'}
            onRetry={() => {
              void refetch();
            }}
          />
        </View>
      ) : data ? (
        <PokemonGrid
          emptyMessage="No favorites yet. Tap the heart on a Pokémon to save it."
          onSelectPokemon={openPokemon}
          pokemon={data}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.three,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  title: {
    fontFamily: RubikFonts.medium,
    fontSize: 24,
    lineHeight: 30,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});