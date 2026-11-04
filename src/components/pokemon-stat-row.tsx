import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PokemonStat } from '@/services/pokemon';

type PokemonStatRowProps = {
  stat: PokemonStat;
};

export function PokemonStatRow({ stat }: PokemonStatRowProps) {
  const theme = useTheme();
  const fillWidth = `${Math.min((stat.value / 255) * 100, 100)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <ThemedText style={[styles.name, { color: theme.midnight, fontFamily: RubikFonts.medium }]}>
          {stat.name}
        </ThemedText>
        <ThemedText style={[styles.value, { color: theme.detailMuted }]}>{stat.value}</ThemedText>
      </View>
      <View
        accessibilityLabel={`${stat.name}: ${stat.value} of 255`}
        style={[styles.track, { backgroundColor: theme.detailStatTrack, borderRadius: Radius.pill }]}>
        <View
          style={[styles.fill, { backgroundColor: theme.purple, borderRadius: Radius.pill, width: fillWidth }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
  },
  value: {
    fontSize: 14,
    lineHeight: 18,
  },
  track: {
    height: Spacing.one,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});