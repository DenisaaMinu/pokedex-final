import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Temporary screen until the real detail screen (issue #3)
export default function PokemonPlaceholderScreen() {
  const theme = useTheme();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedText style={[styles.name, { color: theme.text }]}>{name ?? 'Pokémon'}</ThemedText>
      <ThemedText style={{ color: theme.text }}>#{String(id).padStart(3, '0')}</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    fontFamily: RubikFonts.medium,
    fontSize: 24,
    lineHeight: 30,
  },
});
