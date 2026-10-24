import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

type PokemonCardProps = {
  pokemon: Pokemon;
  onPress: () => void;
};

export function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const theme = useTheme();

  // Shadow on the outer Pressable, because overflow: 'hidden' would cut it off
  return (
    <Pressable
      accessibilityLabel={`${pokemon.name}, number ${pokemon.id}`}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderRadius: Radius.s,
          shadowColor: theme.cardShadow,
        },
      ]}>
      <View style={[styles.content, { backgroundColor: theme.card, borderRadius: Radius.s }]}>
        <View
          style={[
            styles.spriteArea,
            {
              backgroundColor: theme.spriteBackground,
              borderTopLeftRadius: Radius.s,
              borderTopRightRadius: Radius.s,
            },
          ]}>
          <Image contentFit="contain" source={pokemon.spriteUrl} style={styles.sprite} />
          <View
            style={[styles.numberBadge, { backgroundColor: theme.purple, borderRadius: Radius.xs }]}>
            <ThemedText
              style={[
                styles.numberText,
                { color: theme.badgeText, fontFamily: RubikFonts.medium },
              ]}>
              {String(pokemon.id).padStart(3, '0')}
            </ThemedText>
          </View>
        </View>
        <View style={styles.nameStrip}>
          <ThemedText
            numberOfLines={1}
            style={[styles.name, { color: theme.text, fontFamily: RubikFonts.medium }]}>
            {pokemon.name}
          </ThemedText>
          {/* Disabled until the favorites issue adds its menu */}
          <Pressable
            accessibilityLabel={`More options for ${pokemon.name}`}
            accessibilityRole="button"
            disabled
            style={styles.moreButton}>
            <ThemedText style={[styles.moreText, { color: theme.text }]}>⋮</ThemedText>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 3,
  },
  content: {
    overflow: 'hidden',
  },
  spriteArea: {
    aspectRatio: 1,
    justifyContent: 'center',
  },
  sprite: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.half,
  },
  numberText: {
    fontSize: 10,
    lineHeight: 12,
  },
  nameStrip: {
    paddingHorizontal: Spacing.twoAndHalf,
    paddingVertical: Spacing.twoAndHalf,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  name: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  moreButton: {
    width: Spacing.four,
    height: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 24,
    lineHeight: 24,
  },
});
