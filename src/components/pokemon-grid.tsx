import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import ErrorView from '@/components/error-view';
import { PokemonCard } from '@/components/pokemon-card';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

type PokemonGridProps = {
  pokemon: Pokemon[];
  hasNextPage?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  isFetchNextPageError?: boolean;
  onLoadMore?: () => void;
  onRetryLoadMore?: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
  onEndReachedEnabled?: boolean;
  emptyMessage?: string;
  isHidden?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PokemonGrid({
  pokemon,
  hasNextPage = false,
  isFetching = false,
  isFetchingNextPage = false,
  isFetchNextPageError = false,
  onLoadMore,
  onRetryLoadMore,
  onSelectPokemon,
  onEndReachedEnabled = true,
  emptyMessage = 'No Pokémon found.',
  isHidden = false,
  style,
}: PokemonGridProps) {
  const theme = useTheme();

  // FlatList only renders the cards on screen, so long lists stay fast
  return (
    <FlatList
      accessibilityElementsHidden={isHidden}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      data={pokemon}
      importantForAccessibility={isHidden ? 'no-hide-descendants' : 'auto'}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <View style={styles.empty}>
          <ThemedText>{emptyMessage}</ThemedText>
        </View>
      }
      ListFooterComponent={
        isFetchNextPageError && onRetryLoadMore ? (
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
        if (
          onEndReachedEnabled &&
          onLoadMore &&
          hasNextPage &&
          !isFetching &&
          !isFetchingNextPage &&
          !isFetchNextPageError
        ) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      pointerEvents={isHidden ? 'none' : 'auto'}
      renderItem={({ item }) => (
        <PokemonCard onPress={() => onSelectPokemon(item)} pokemon={item} />
      )}
      style={style}
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
