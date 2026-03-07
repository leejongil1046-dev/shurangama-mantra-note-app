import { NotoSerifKR_400Regular } from '@expo-google-fonts/noto-serif-kr/400Regular';
import { NotoSerifKR_500Medium } from '@expo-google-fonts/noto-serif-kr/500Medium';
import { NotoSerifKR_600SemiBold } from '@expo-google-fonts/noto-serif-kr/600SemiBold';
import { NotoSerifKR_700Bold } from '@expo-google-fonts/noto-serif-kr/700Bold';
import { useFonts } from '@expo-google-fonts/noto-serif-kr/useFonts';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { APP_TITLE, Colors, FONT_MANTRA_700 } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [fontsLoaded] = useFonts({
    NotoSerifKR_400Regular,
    NotoSerifKR_500Medium,
    NotoSerifKR_600SemiBold,
    NotoSerifKR_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: FONT_MANTRA_700, fontSize: 20 },
          headerTintColor: themeColors.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: true, title: APP_TITLE }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
