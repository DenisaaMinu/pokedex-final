//props message: string and onRetry: () => void. It shows the message and a Pressable "Try again" that calls onRetry. Colours from the theme.
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  const colors = useTheme();
  return (
    <View>
      <Text style={{ color: colors.text }}>{message}</Text>
      <Pressable onPress={onRetry}>
        <Text style={{ color: colors.badge }}>Try again</Text>
      </Pressable>
    </View>
  );
}