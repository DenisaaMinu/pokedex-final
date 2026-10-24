import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorView from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonSearchBar } from '@/components/pokemon-search-bar';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { usePokemonList } from '@/hooks/use-pokemon-list';
import { filterPokemon, usePokemonSearch } from '@/hooks/use-pokemon-search';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

export default function HomeScreen() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const isSearching = searchText.trim().length > 0;
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
  const {
    data: searchablePokemon,
    error: searchError,
    isError: isSearchError,
    isPending: isSearchPending,
    refetch: refetchSearch,
  } = usePokemonSearch();

  // Pass the name along, so the next screen needs no extra request
  function openPokemon(pokemon: Pokemon) {
    router.push({
      pathname: '/pokemon/[id]',
      params: { id: String(pokemon.id), name: pokemon.name },
    });
  }

  // Full error screen only when nothing is loaded yet, later errors show in the footer
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <PokemonSearchBar onChangeText={setSearchText} value={searchText} />
        <ThemedText style={[styles.title, { color: theme.midnight }]}>All Pokémon</ThemedText>
      </View>
      <View style={styles.grids}>
        {isPending ? (
          <View style={[styles.state, isSearching && styles.hidden]}>
            <ActivityIndicator color={theme.purple} size="large" />
          </View>
        ) : isError && !data ? (
          <View style={[styles.state, isSearching && styles.hidden]}>
            <ErrorView
              message={error instanceof Error ? error.message : 'Unable to load Pokémon.'}
              onRetry={() => {
                void refetch();
              }}
            />
          </View>
        ) : !data ? (
          <View style={[styles.state, isSearching && styles.hidden]}>
            <ActivityIndicator color={theme.purple} size="large" />
          </View>
        ) : (
          // Only hidden while searching, so pages and scroll stay; no loading more then
          <PokemonGrid
            onEndReachedEnabled={!isSearching}
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
            isHidden={isSearching}
            style={isSearching ? styles.hiddenGrid : undefined}
          />
        )}
        {isSearching ? (
          isSearchPending ? (
            <View style={styles.state}>
              <ActivityIndicator color={theme.purple} size="large" />
            </View>
          ) : isSearchError && !searchablePokemon ? (
            <View style={styles.state}>
              <ErrorView
                message={
                  searchError instanceof Error
                    ? searchError.message
                    : 'Unable to load Pokémon search.'
                }
                onRetry={() => {
                  void refetchSearch();
                }}
              />
            </View>
          ) : searchablePokemon ? (
            <PokemonGrid
              emptyMessage="No Pokémon found"
              onSelectPokemon={openPokemon}
              pokemon={filterPokemon(searchablePokemon, searchText)}
            />
          ) : null
        ) : null}
      </View>
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
    gap: Spacing.three,
  },
  grids: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  hiddenGrid: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
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
