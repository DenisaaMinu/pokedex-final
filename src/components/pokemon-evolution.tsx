import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import ErrorView from '@/components/error-view';
import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import { useEvolutionChain, usePokemonSpecies } from '@/hooks/use-evolution-chain';
import { useTheme } from '@/hooks/use-theme';
import type { PokemonDetail } from '@/services/pokemon';

type PokemonEvolutionProps = {
  pokemon: PokemonDetail;
};

export function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {
  const theme = useTheme();
  const speciesQuery = usePokemonSpecies(pokemon.id, pokemon.speciesUrl);
  const evolutionQuery = useEvolutionChain(
    speciesQuery.data?.chainId,
    speciesQuery.isSuccess
  );

  if (speciesQuery.isPending) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={theme.purple} size="large" />
      </View>
    );
  }

  if (speciesQuery.isError) {
    return (
      <View style={styles.state}>
        <ErrorView
          message={speciesQuery.error instanceof Error ? speciesQuery.error.message : 'Unable to load Pokémon species.'}
          onRetry={() => {
            void speciesQuery.refetch();
          }}
        />
      </View>
    );
  }

  if (evolutionQuery.isPending) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={theme.purple} size="large" />
      </View>
    );
  }

  if (evolutionQuery.isError) {
    return (
      <View style={styles.state}>
        <ErrorView
          message={evolutionQuery.error instanceof Error ? evolutionQuery.error.message : 'Unable to load the evolution chain.'}
          onRetry={() => {
            void evolutionQuery.refetch();
          }}
        />
      </View>
    );
  }

  if (evolutionQuery.data.length === 1) {
    return (
      <View style={styles.state}>
        <ThemedText style={[styles.empty, { color: theme.detailMuted }]}>
          This Pokémon does not evolve.
        </ThemedText>
      </View>
    );
  }

  return (
    // One column, top to bottom, so a family with many branches (Eevee) still fits
    <View style={styles.chain}>
      {evolutionQuery.data.map((entry, index) => {
        const isCurrentPokemon = entry.id === pokemon.id;

        return (
          <View key={entry.id} style={styles.chainEntry}>
            {index > 0 ? (
              <View accessibilityElementsHidden style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: theme.detailMuted }]} />
                <View style={[styles.dot, { backgroundColor: theme.detailMuted }]} />
                <View style={[styles.dot, { backgroundColor: theme.detailMuted }]} />
              </View>
            ) : null}
            <Pressable
              accessibilityLabel={`${entry.name}, number ${String(entry.id).padStart(3, '0')}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isCurrentPokemon }}
              disabled={isCurrentPokemon}
              onPress={() => {
                router.push({
                  pathname: '/pokemon/[id]',
                  params: { id: String(entry.id), name: entry.name },
                });
              }}
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: isCurrentPokemon ? theme.purple : theme.detailSilver,
                  borderRadius: Radius.s,
                },
              ]}>
              <View style={[styles.numberBadge, { backgroundColor: theme.purple, borderRadius: Radius.xs }]}>
                <ThemedText style={[styles.number, { color: theme.badgeText, fontFamily: RubikFonts.medium }]}>
                  #{String(entry.id).padStart(3, '0')}
                </ThemedText>
              </View>
              <Image contentFit="contain" source={entry.spriteUrl} style={styles.sprite} />
              <ThemedText
                numberOfLines={1}
                style={[styles.name, { color: theme.text, fontFamily: RubikFonts.medium }]}>
                {entry.name}
              </ThemedText>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    minHeight: Spacing.evolutionCardHeight + Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  empty: {
    fontFamily: RubikFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  chain: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  chainEntry: {
    alignItems: 'center',
  },
  dots: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  dot: {
    width: Spacing.evolutionDotSize,
    height: Spacing.evolutionDotSize,
    borderRadius: Radius.pill,
  },
  card: {
    width: Spacing.evolutionCardWidth,
    height: Spacing.evolutionCardHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    padding: Spacing.two,
    borderWidth: Spacing.half,
  },
  numberBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.half,
  },
  number: {
    fontSize: 10,
    lineHeight: 12,
  },
  sprite: {
    width: Spacing.evolutionSpriteSize,
    height: Spacing.evolutionSpriteSize,
  },
  name: {
    maxWidth: '100%',
    fontSize: 12,
    lineHeight: 16,
  },
});