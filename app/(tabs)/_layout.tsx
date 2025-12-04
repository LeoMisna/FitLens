// Di file: app/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { useFonts } from "expo-font";

export default function TabLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });

  // --- [PERBAIKAN ESLINT] ---
  // Kita beri nama pada fungsi yang dikembalikan
  // untuk memenuhi aturan 'react/display-name'.
  const renderIcon = (name: React.ComponentProps<typeof Ionicons>["name"]) => {
    // Beri nama pada fungsi komponen ini
    function TabBarIcon({ color }: { color: string }) {
      if (fontError) {
        return <Text style={{ color, fontSize: 24 }}>?</Text>;
      }
      if (!fontsLoaded) {
        return null;
      }
      return <Ionicons name={name} size={24} color={color} />;
    }

    // Kembalikan komponen yang sudah punya nama
    return TabBarIcon;
  };
  // --- AKHIR PERBAIKAN ---

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: renderIcon("home"),
        }}
      />

      <Tabs.Screen
        name="nutrition"
        options={{
          title: "Nutrition",
          tabBarIcon: renderIcon("nutrition"),
        }}
      />

      <Tabs.Screen
        name="sleep"
        options={{
          title: "Sleep",
          tabBarIcon: renderIcon("moon"),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan Makanan",
          headerShown: false,
          // --- [PERBAIKAN ESLINT] ---
          // Kita beri nama pada fungsi 'tabBarIcon' ini juga
          tabBarIcon: function ScanTabBarIcon({
            focused,
          }: {
            focused: boolean;
          }) {
            if (fontError) return <Text>?</Text>;
            if (!fontsLoaded) return null;

            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#FFF",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Ionicons name="camera" size={30} color="#000" />
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="device"
        options={{
          title: "Device",
          tabBarIcon: renderIcon("phone-portrait"),
        }}
      />

      <Tabs.Screen
        name="consultation"
        options={{
          title: "Consultation",
          tabBarIcon: renderIcon("chatbubble-ellipses"),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: renderIcon("people"),
        }}
      />
    </Tabs>
  );
}
