import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorView from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { usePokemonList } from '@/hooks/use-pokemon-list';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

export default function HomeScreen() {
  const theme = useTheme();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    refetch,
  } = usePokemonList();

  function openPokemon(pokemon: Pokemon) {
    router.push({
      pathname: '/pokemon/[id]',
      params: { id: String(pokemon.id), name: pokemon.name },
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedText style={[styles.title, { color: theme.midnight }]}>All Pokémon</ThemedText>
      {isPending ? (
        <View style={styles.state}>
          <ActivityIndicator color={theme.purple} size="large" />
        </View>
      ) : isError && !data ? (
        <View style={styles.state}>
          <ErrorView
            message={error instanceof Error ? error.message : 'Unable to load Pokémon.'}
            onRetry={() => {
              void refetch();
            }}
          />
        </View>
      ) : !data ? (
        <View style={styles.state}>
          <ActivityIndicator color={theme.purple} size="large" />
        </View>
      ) : (
        <PokemonGrid
          hasNextPage={Boolean(hasNextPage)}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          isFetchNextPageError={isFetchNextPageError}
          onLoadMore={() => {
            void fetchNextPage();
          }}
          onRetryLoadMore={() => {
            void fetchNextPage();
          }}
          onSelectPokemon={openPokemon}
          pokemon={data.pages.flatMap((page) => page.pokemon)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.three,
  },
  title: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
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
