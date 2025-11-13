// Di dalam file: app/_layout.tsx

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    console.error("FATAL: Font gagal dimuat", fontError);
    return <Text style={{ flex: 1, color: 'red', textAlign: 'center', marginTop: 100 }}>
      Gagal memuat font ikon. Coba restart aplikasi.
    </Text>;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <> 
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          
          {/* --- [INI BAGIAN PENTING] --- */}
          {/* Pastikan baris ini ada dan namanya "addMeal" */}
          <Stack.Screen 
            name="addMeal" 
            options={{ presentation: 'modal', headerShown: false }} 
          />
          {/* --------------------------- */}
          
        </Stack>
        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}