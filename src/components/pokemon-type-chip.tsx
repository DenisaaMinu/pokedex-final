import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getPokemonTypeColorKey, Radius, RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PokemonTypeChipProps = {
  name: string;
  typeKey: string;
};

export function PokemonTypeChip({ name, typeKey }: PokemonTypeChipProps) {
  const theme = useTheme();
  const colorKey = getPokemonTypeColorKey(typeKey);

  return (
    <View
      accessibilityLabel={`${name} type`}
      style={[styles.chip, { backgroundColor: theme.detailTypeChip, borderRadius: Radius.pill }]}>
      <View
        style={[
          styles.dot,
          { backgroundColor: colorKey ? theme[colorKey] : theme.purple, borderRadius: Radius.pill },
        ]}
      />
      <ThemedText style={[styles.name, { color: theme.midnight, fontFamily: RubikFonts.medium }]}>
        {name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  dot: {
    width: Spacing.two,
    height: Spacing.two,
  },
  name: {
    fontSize: 12,
    lineHeight: 16,
  },
});