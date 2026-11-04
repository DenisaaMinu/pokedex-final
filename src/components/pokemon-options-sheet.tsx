import { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    Share,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, RubikFonts, Spacing } from '@/constants/theme';
import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Pokemon } from '@/services/pokemon';

type PokemonOptionsSheetProps = {
  pokemon: Pokemon | null;
  onClose: () => void;
  onOpenPokemon: (pokemon: Pokemon) => void;
};

export function PokemonOptionsSheet({ pokemon, onClose, onOpenPokemon }: PokemonOptionsSheetProps) {
  const theme = useTheme();
  const [isSharing, setIsSharing] = useState(false);
  const { data: isSaved } = useIsFavorite(pokemon?.id ?? 0);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  async function sharePokemon() {
    if (!pokemon) {
      return;
    }

    setIsSharing(true);
    try {
      await Share.share({
        message: `Check out ${pokemon.name} (#${String(pokemon.id).padStart(3, '0')}) in my Pokédex!`,
      });
      onClose();
    } catch {
      Alert.alert('Unable to share Pokémon', 'Please try again.');
    } finally {
      setIsSharing(false);
    }
  }

  function toggleFavorite() {
    if (!pokemon) {
      return;
    }

    if (isSaved) {
      removeFavorite.mutate(pokemon.id);
    } else {
      addFavorite.mutate(pokemon);
    }
    onClose();
  }

  function openPokemon() {
    if (pokemon) {
      onOpenPokemon(pokemon);
      onClose();
    }
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={pokemon !== null}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close options"
          accessibilityRole="button"
          onPress={onClose}
          style={[styles.backdrop, { backgroundColor: theme.modalBackdrop }]}
        />
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>
          <View style={[styles.handle, { backgroundColor: theme.textSecondary }]} />
          <ThemedText style={[styles.title, { color: theme.midnight }]}>Options</ThemedText>
          <View style={styles.actions}>
            <OptionButton label="Open Pokémon" onPress={openPokemon} />
            <OptionButton
              label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
              onPress={toggleFavorite}
            />
            <OptionButton disabled={isSharing} label="Share" onPress={() => void sharePokemon()} />
            <OptionButton label="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

type OptionButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

function OptionButton({ disabled = false, label, onPress }: OptionButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement },
      ]}>
      <ThemedText style={[styles.actionText, { color: theme.text }]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  opacity: 0.4,
  },
  sheet: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    borderTopLeftRadius: Radius.l,
    borderTopRightRadius: Radius.l,
  },
  handle: {
    alignSelf: 'center',
    width: Spacing.five,
    height: Spacing.one,
    borderRadius: Radius.pill,
    opacity: 0.35,
  },
  title: {
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    fontFamily: RubikFonts.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  actions: {
    gap: Spacing.one,
  },
  action: {
    minHeight: Spacing.six,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.s,
  },
  actionText: {
    fontFamily: RubikFonts.medium,
    fontSize: 16,
    lineHeight: 22,
  },
});