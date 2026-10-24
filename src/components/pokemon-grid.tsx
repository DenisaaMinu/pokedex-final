import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import ErrorView from '@/components/error-view';
import { PokemonCard } from '@/components/pokemon-card';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

type PokemonGridProps = {
  pokemon: Pokemon[];
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onLoadMore: () => void;
  onRetryLoadMore: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
};

export function PokemonGrid({
  pokemon,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadMore,
  onRetryLoadMore,
  onSelectPokemon,
}: PokemonGridProps) {
  const theme = useTheme();

  // FlatList only renders the cards on screen, so long lists stay fast
  return (
    <FlatList
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      data={pokemon}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <View style={styles.empty}>
          <ThemedText>No Pokémon found.</ThemedText>
        </View>
      }
      ListFooterComponent={
        isFetchNextPageError ? (
          <View style={styles.footer}>
            <ErrorView message="Unable to load more Pokémon." onRetry={onRetryLoadMore} />
          </View>
        ) : isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.purple} size="small" />
          </View>
        ) : undefined
      }
      numColumns={2}
      onEndReached={() => {
        // Never load twice, and never retry a failed page in a loop
        if (hasNextPage && !isFetching && !isFetchingNextPage && !isFetchNextPageError) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <PokemonCard onPress={() => onSelectPokemon(item)} pokemon={item} />
      )}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    // Room for the tab bar, so the last row is not hidden
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  row: {
    gap: Spacing.three,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
