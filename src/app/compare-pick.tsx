import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorView from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonSearchBar } from '@/components/pokemon-search-bar';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { filterPokemon, usePokemonSearch } from '@/hooks/use-pokemon-search';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

export default function ComparePickScreen() {
  const theme = useTheme();
  const { first } = useLocalSearchParams<{ first: string }>();
  const [searchText, setSearchText] = useState('');
  const isSearching = searchText.trim().length > 0;
  const { data, error, isError, isPending, refetch } = usePokemonSearch();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  function selectPokemon(pokemon: Pokemon) {
    router.push({
      pathname: '/compare',
      params: { first, second: String(pokemon.id) },
    });
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={goBack} style={styles.backButton}>
            <ThemedText style={[styles.backLabel, { color: theme.midnight }]}>‹ Vorige</ThemedText>
          </Pressable>
          <ThemedText style={[styles.title, { color: theme.midnight }]}>Choose a Pokémon</ThemedText>
          <PokemonSearchBar onChangeText={setSearchText} value={searchText} />
        </View>
        <View style={styles.results}>
          {isPending ? (
            <View style={styles.state}>
              <ActivityIndicator color={theme.purple} size="large" />
            </View>
          ) : isError && !data ? (
            <View style={styles.state}>
              <ErrorView
                message={error instanceof Error ? error.message : 'Unable to load Pokémon search.'}
                onRetry={() => {
                  void refetch();
                }}
              />
            </View>
          ) : data ? (
            <PokemonGrid
              emptyMessage="No Pokémon found"
              keyboardShouldPersistTaps="handled"
              onSelectPokemon={selectPokemon}
              pokemon={isSearching ? filterPokemon(data, searchText) : data}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </>
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
  backButton: {
    minHeight: Spacing.five,
    justifyContent: 'center',
  },
  backLabel: {
    fontFamily: RubikFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontFamily: RubikFonts.semiBold,
    fontSize: 24,
    lineHeight: 30,
  },
  results: {
    flex: 1,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});