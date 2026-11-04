import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  // NativeTabs uses the real tab bar of iPhone and Android, the name of each Trigger is its file in (tabs)
  return (
    <NativeTabs
      backgroundColor={colors.background}
      blurEffect="none"
      disableTransparentOnScrollEdge
      indicatorColor={colors.backgroundElement}
      iconColor={{ default: colors.midnight, selected: colors.purple }}
      labelStyle={{ default: { color: colors.midnight }, selected: { color: colors.purple } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Pokémons</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/pokeball.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: 'favorite_border', selected: 'favorite' }}
          sf={{ default: 'heart', selected: 'heart.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
