import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import type { ComparedStat } from '@/hooks/use-compare';
import { useTheme } from '@/hooks/use-theme';

type CompareStatRowProps = {
  stat: ComparedStat;
};

export function CompareStatRow({ stat }: CompareStatRowProps) {
  const theme = useTheme();
  const firstColor = stat.winner === 'second' ? theme.detailSilver : theme.purple;
  const secondColor = stat.winner === 'first' ? theme.detailSilver : theme.purple;

  return (
    <View
      accessibilityLabel={`${stat.name}: ${stat.firstValue} for the first Pokémon, ${stat.secondValue} for the second`}
      style={styles.container}>
      <ThemedText style={[styles.name, { color: theme.midnight }]}>{stat.name}</ThemedText>
      <View style={styles.values}>
        <ThemedText style={[styles.value, { color: theme.detailMuted }]}>{stat.firstValue}</ThemedText>
        <ThemedText style={[styles.value, { color: theme.detailMuted }]}>{stat.secondValue}</ThemedText>
      </View>
      <View style={styles.bars}>
        {/* Lighter track than detailStatTrack, which is the same colour as the silver (weaker) bar */}
        <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: firstColor,
                width: `${Math.min((stat.firstValue / 255) * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: secondColor,
                width: `${Math.min((stat.secondValue / 255) * 100, 100)}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  name: {
    alignSelf: 'center',
    fontFamily: RubikFonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  values: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    flex: 1,
    fontFamily: RubikFonts.regular,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  bars: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  track: {
    flex: 1,
    height: Spacing.one,
    overflow: 'hidden',
    borderRadius: Radius.pill,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});