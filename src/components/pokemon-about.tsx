import { StyleSheet, View } from 'react-native';

import { PokemonTypeChip } from '@/components/pokemon-type-chip';
import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PokemonDetail } from '@/services/pokemon';

type PokemonAboutProps = {
  pokemon: PokemonDetail;
};

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <ThemedText style={[styles.label, { color: theme.detailMuted }]}>{label}</ThemedText>
      <ThemedText style={[styles.value, { color: theme.midnight, fontFamily: RubikFonts.medium }]}>
        {value}
      </ThemedText>
    </View>
  );
}

export function PokemonAbout({ pokemon }: PokemonAboutProps) {
  const theme = useTheme();

  return (
    <View style={styles.content}>
      <InfoRow label="Name" value={pokemon.name} />
      <InfoRow label="ID" value={String(pokemon.id).padStart(3, '0')} />
      <InfoRow
        label="Base"
        value={pokemon.baseExperience === null ? '–' : `${pokemon.baseExperience} XP`}
      />
      <InfoRow label="Weight" value={`${pokemon.weightKg.toFixed(1)} kg`} />
      <InfoRow label="Height" value={`${pokemon.heightM.toFixed(1)} m`} />
      <View style={styles.row}>
        <ThemedText style={[styles.label, { color: theme.detailMuted }]}>Types</ThemedText>
        <View style={styles.chips}>
          {pokemon.types.map((type) => (
            <PokemonTypeChip key={type.key} name={type.name} typeKey={type.key} />
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText style={[styles.label, { color: theme.detailMuted }]}>Abilities</ThemedText>
        <ThemedText style={[styles.value, { color: theme.midnight, fontFamily: RubikFonts.medium }]}>
          {pokemon.abilities.join(', ') || '–'}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: Spacing.four,
  },
  label: {
    width: '32%',
    fontSize: 14,
    lineHeight: 20,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 20,
  },
  chips: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
});