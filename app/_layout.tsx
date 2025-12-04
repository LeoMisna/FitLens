// Di file: app/_layout.tsx
import "react-native-gesture-handler";
// ... import lainnya di bawah ini
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    return <Text>Error Font</Text>;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />

          {/* Halaman Modal untuk Tambah Makanan */}
          <Stack.Screen
            name="addMeal"
            options={{ presentation: "modal", headerShown: false }}
          />

          {/* Halaman Modal untuk Tambah Tidur */}
          <Stack.Screen
            name="newSleep"
            options={{ presentation: "modal", headerShown: false }}
          />

          {/* [PENTING] Halaman Musik harus didaftarkan di sini */}
          <Stack.Screen
            name="relaxation"
            options={{ headerShown: false, presentation: "card" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}
