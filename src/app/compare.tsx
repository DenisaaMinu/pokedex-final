import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompareStatRow } from '@/components/compare-stat-row';
import ErrorView from '@/components/error-view';
import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import { compareStats } from '@/hooks/use-compare';
import { usePokemon } from '@/hooks/use-pokemon';
import { useTheme } from '@/hooks/use-theme';

export default function CompareScreen() {
  const theme = useTheme();
  const { first, second } = useLocalSearchParams<{ first: string; second: string }>();
  const firstPokemonQuery = usePokemon(Number(first));
  const secondPokemonQuery = usePokemon(Number(second));
  const firstPokemon = firstPokemonQuery.data;
  const secondPokemon = secondPokemonQuery.data;
  const comparison =
    firstPokemon && secondPokemon
      ? compareStats(firstPokemon.stats, secondPokemon.stats)
      : null;

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/compare-pick', params: { first } });
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" onPress={goBack} style={styles.backButton}>
            <ThemedText style={[styles.backLabel, { color: theme.midnight }]}>‹ Vorige</ThemedText>
          </Pressable>
          <ThemedText style={[styles.title, { color: theme.midnight }]}>Compare Pokémon</ThemedText>
          <View style={styles.pokemonPair}>
            <View style={[styles.pokemonCard, { backgroundColor: theme.card, borderRadius: Radius.s }]}>
              {firstPokemonQuery.isPending ? (
                <ActivityIndicator color={theme.purple} size="large" />
              ) : firstPokemonQuery.isError || !firstPokemon ? (
                <ErrorView
                  message={
                    firstPokemonQuery.error instanceof Error
                      ? firstPokemonQuery.error.message
                      : 'Unable to load Pokémon.'
                  }
                  onRetry={() => {
                    void firstPokemonQuery.refetch();
                  }}
                />
              ) : (
                <>
                  <Image
                    accessibilityLabel={`${firstPokemon.name} sprite`}
                    contentFit="contain"
                    source={firstPokemon.spriteUrl}
                    style={styles.sprite}
                  />
                  <ThemedText numberOfLines={1} style={[styles.pokemonName, { color: theme.midnight }]}>
                    {firstPokemon.name}
                  </ThemedText>
                  <ThemedText style={[styles.number, { color: theme.detailMuted }]}>
                    #{String(firstPokemon.id).padStart(3, '0')}
                  </ThemedText>
                </>
              )}
            </View>
            <View style={[styles.pokemonCard, { backgroundColor: theme.card, borderRadius: Radius.s }]}>
              {secondPokemonQuery.isPending ? (
                <ActivityIndicator color={theme.purple} size="large" />
              ) : secondPokemonQuery.isError || !secondPokemon ? (
                <ErrorView
                  message={
                    secondPokemonQuery.error instanceof Error
                      ? secondPokemonQuery.error.message
                      : 'Unable to load Pokémon.'
                  }
                  onRetry={() => {
                    void secondPokemonQuery.refetch();
                  }}
                />
              ) : (
                <>
                  <Image
                    accessibilityLabel={`${secondPokemon.name} sprite`}
                    contentFit="contain"
                    source={secondPokemon.spriteUrl}
                    style={styles.sprite}
                  />
                  <ThemedText numberOfLines={1} style={[styles.pokemonName, { color: theme.midnight }]}>
                    {secondPokemon.name}
                  </ThemedText>
                  <ThemedText style={[styles.number, { color: theme.detailMuted }]}>
                    #{String(secondPokemon.id).padStart(3, '0')}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
          {comparison && firstPokemon && secondPokemon ? (
            <>
              <View style={styles.stats}>
                {comparison.stats.map((stat) => (
                  <CompareStatRow key={stat.name} stat={stat} />
                ))}
              </View>
              <View style={[styles.total, { backgroundColor: theme.detailHeader, borderRadius: Radius.s }]}>
                <ThemedText style={[styles.totalText, { color: theme.midnight }]}>
                  {comparison.winner === 'tie'
                    ? "It's a draw"
                    : `${comparison.winner === 'first' ? firstPokemon.name : secondPokemon.name} wins ${comparison.winner === 'first' ? comparison.firstWins : comparison.secondWins} of ${comparison.stats.length} stats`}
                </ThemedText>
              </View>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
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
  pokemonPair: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pokemonCard: {
    flex: 1,
    minHeight: Spacing.six + Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
    gap: Spacing.one,
  },
  sprite: {
    width: Spacing.six,
    height: Spacing.six,
  },
  pokemonName: {
    maxWidth: '100%',
    fontFamily: RubikFonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  number: {
    fontFamily: RubikFonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  stats: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  total: {
    alignItems: 'center',
    padding: Spacing.three,
  },
  totalText: {
    fontFamily: RubikFonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});