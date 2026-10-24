import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { RubikFonts } from '@/constants/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	// Rubik from fonts.zip, only the weights the app uses
	const [fontsLoaded, fontError] = useFonts({
		[RubikFonts.regular]: require('@/assets/fonts/Rubik-Regular.ttf'),
		[RubikFonts.medium]: require('@/assets/fonts/Rubik-Medium.ttf'),
		[RubikFonts.semiBold]: require('@/assets/fonts/Rubik-SemiBold.ttf'),
		[RubikFonts.extraBold]: require('@/assets/fonts/Rubik-ExtraBold.ttf'),
	});

	if (fontError) {
		throw fontError;
	}

	// Show nothing until the fonts are loaded, so the text never jumps from one font to another
	if (!fontsLoaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<AnimatedSplashOverlay />
				<Stack>
				  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			    </Stack>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
