import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorView from '@/components/error-view';
import { PokemonAbout } from '@/components/pokemon-about';
import { PokemonDetailTabs, type PokemonDetailTab } from '@/components/pokemon-detail-tabs';
import { PokemonEvolution } from '@/components/pokemon-evolution';
import { PokemonStatRow } from '@/components/pokemon-stat-row';
import { PokemonTypeChip } from '@/components/pokemon-type-chip';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/use-favorites';
import { usePokemon } from '@/hooks/use-pokemon';
import { useTheme } from '@/hooks/use-theme';

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<PokemonDetailTab>('About');
  const { data, error, isError, isPending, refetch } = usePokemon(Number(idParam));
  const favoriteQuery = useIsFavorite(data?.id ?? 0);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  function toggleFavorite() {
    if (!data) {
      return;
    }

    if (favoriteQuery.data) {
      removeFavorite.mutate(data.id);
    } else {
      addFavorite.mutate({ id: data.id, name: data.name, spriteUrl: data.spriteUrl });
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {isPending ? (
          <View style={styles.state}>
            <ActivityIndicator color={theme.purple} size="large" />
          </View>
        ) : isError || !data ? (
          <View style={styles.state}>
            <ErrorView
              message={error instanceof Error ? error.message : 'Unable to load Pokémon.'}
              onRetry={() => {
                void refetch();
              }}
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.hero, { backgroundColor: theme.detailHeader }]}>
              <View style={styles.heroContent}>
                <View style={styles.navigation}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace('/(tabs)');
                      }
                    }}
                    style={styles.backButton}>
                    <ThemedText style={[styles.backLabel, { color: theme.midnight }]}>
                      ‹ Vorige
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={
                      favoriteQuery.data
                        ? `Remove ${data.name} from favorites`
                        : `Add ${data.name} to favorites`
                    }
                    accessibilityRole="button"
                    onPress={toggleFavorite}
                    style={styles.heartButton}>
                    <ThemedText
                      style={[
                        styles.heart,
                        { color: favoriteQuery.data ? theme.favoriteRed : theme.midnight },
                      ]}>
                      {favoriteQuery.data ? '♥' : '♡'}
                    </ThemedText>
                  </Pressable>
                </View>
                <View style={styles.titleRow}>
                  <ThemedText style={[styles.title, { color: theme.midnight }]}>
                    {data.name}
                  </ThemedText>
                  <ThemedText style={[styles.number, { color: theme.detailSilver }]}>
                    #{String(data.id).padStart(3, '0')}
                  </ThemedText>
                </View>
                <View style={styles.types}>
                  {data.types.map((type) => (
                    <PokemonTypeChip key={type.key} name={type.name} typeKey={type.key} />
                  ))}
                </View>
              </View>
              <Image
                accessibilityLabel={`${data.name} official artwork`}
                contentFit="contain"
                source={data.artworkUrl}
                style={styles.artwork}
                transition={200}
              />
            </View>
            <View style={styles.details}>
              <PokemonDetailTabs activeTab={activeTab} onSelectTab={setActiveTab} />
              {activeTab === 'About' ? <PokemonAbout pokemon={data} /> : null}
              {activeTab === 'Stats' ? (
                <View style={styles.stats}>
                  {data.stats.map((stat) => (
                    <PokemonStatRow key={stat.name} stat={stat} />
                  ))}
                </View>
              ) : null}
              {activeTab === 'Evolution' ? <PokemonEvolution pokemon={data} /> : null}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  state: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.four,
  },
  hero: {
    height: Spacing.detailHeroHeight,
    overflow: 'visible',
  },
  heroContent: {
    paddingHorizontal: Spacing.three,
  },
  navigation: {
    minHeight: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  heartButton: {
    width: Spacing.five,
    height: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 24,
    lineHeight: 28,
  },
  titleRow: {
    marginTop: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flexShrink: 1,
    fontFamily: RubikFonts.semiBold,
    fontSize: 24,
    lineHeight: 30,
  },
  number: {
    fontFamily: RubikFonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  types: {
    marginTop: Spacing.three,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  artwork: {
    position: 'absolute',
    top: Spacing.detailArtworkTop,
    alignSelf: 'center',
    width: Spacing.detailArtworkSize,
    height: Spacing.detailArtworkSize,
  },
  details: {
    marginTop: Spacing.detailBodyTop,
  },
  stats: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
});
