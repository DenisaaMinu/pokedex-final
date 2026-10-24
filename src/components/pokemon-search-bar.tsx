import { SymbolView } from 'expo-symbols';
import { StyleSheet, TextInput, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PokemonSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

// Controlled input: the text lives in the screen's state
export function PokemonSearchBar({ value, onChangeText }: PokemonSearchBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.card, borderRadius: Radius.l }]}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={20}
        tintColor={theme.textSecondary}
      />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search for Pokémon"
        onChangeText={onChangeText}
        placeholder="Search for Pokémon.."
        placeholderTextColor={theme.textSecondary}
        returnKeyType="search"
        style={[styles.input, { color: theme.text }]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.two,
  },
});
