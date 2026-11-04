import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RubikFonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PokemonDetailTab = 'About' | 'Stats' | 'Evolution';

const tabs: PokemonDetailTab[] = ['About', 'Stats', 'Evolution'];

type PokemonDetailTabsProps = {
  activeTab: PokemonDetailTab;
  onSelectTab: (tab: PokemonDetailTab) => void;
};

export function PokemonDetailTabs({ activeTab, onSelectTab }: PokemonDetailTabsProps) {
  const theme = useTheme();

  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={tab}
            onPress={() => onSelectTab(tab)}
            style={[styles.tab, { borderBottomColor: isActive ? theme.purple : 'transparent' }]}>
            <ThemedText
              style={[
                styles.label,
                {
                  color: isActive ? theme.purple : theme.detailMuted,
                  fontFamily: isActive ? RubikFonts.semiBold : RubikFonts.regular,
                },
              ]}>
              {tab}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Spacing.five,
    borderBottomWidth: Spacing.half,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
});