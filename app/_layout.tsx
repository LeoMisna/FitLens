// Di dalam file: app/_layout.tsx

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Text } from 'react-native'; // [BARU] Impor Text untuk menampilkan error

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    // Kita gunakan path manual yang paling pasti
    'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    // Sembunyikan splash screen HANYA JIKA font selesai (sukses atau gagal)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // --- [PERBAIKAN LOGIKA UTAMA ADA DI SINI] ---

  // 1. Jika font GAGAL dimuat, tampilkan pesan error dan berhenti
  if (fontError) {
    console.error("FATAL: Font gagal dimuat", fontError);
    // Tampilkan pesan error di layar alih-alih crash
    return <Text style={{ flex: 1, color: 'red', textAlign: 'center', marginTop: 100 }}>
      Gagal memuat font ikon. Coba restart aplikasi.
    </Text>;
  }

  // 2. Jika font SEDANG dimuat (dan belum ada error),
  // jangan render apa-apa (splash screen akan tetap terlihat)
  if (!fontsLoaded) {
    return null;
  }

  // 3. HANYA JIKA font SUKSES dimuat (fontsLoaded = true DAN fontError = false),
  // barulah kita render sisa aplikasinya.
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <> 
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}