import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../src/store';
import { COLORS } from '../src/constants';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
  },
};

export default function RootLayout() {
  const loadSettings = useAppStore((s) => s.loadSettings);
  const loadEntries = useAppStore((s) => s.loadEntries);

  useEffect(() => {
    loadSettings();
    loadEntries();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
