import { Ionicons } from '@expo/vector-icons'; // [DIUBAH]
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native'; // [BARU]

// [DIHAPUS] Kita tidak memakai komponen kustom dari template
// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // [DIHAPUS] Kita akan 'hardcode' tema gelap
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // [BARU] Styling untuk Tab Bar gelap
        tabBarActiveTintColor: '#FFFFFF', // Ikon aktif (Putih)
        tabBarInactiveTintColor: '#888888', // Ikon tidak aktif (Abu-abu)
        tabBarStyle: {
          backgroundColor: '#000000', // Latar belakang Tab Bar (Hitam)
          borderTopWidth: 0, // Hapus garis di atas tab bar
        },
        tabBarLabelStyle: {
          fontSize: 10, // Perkecil font label
        },
      }}>
      
      {/* 1. Tab Dashboard (Home) */}
      <Tabs.Screen
        name="index" // Menunjuk ke app/(tabs)/index.tsx
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      {/* 2. Tab Nutrition (BARU) */}
      <Tabs.Screen
        name="nutrition" // Menunjuk ke app/(tabs)/nutrition.tsx
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => (
            <Ionicons name="nutrition" size={24} color={color} />
          ),
        }}
      />
      
      {/* 3. Tab Sleep (BARU) */}
      <Tabs.Screen
        name="sleep" // Menunjuk ke app/(tabs)/sleep.tsx
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color }) => (
            <Ionicons name="moon" size={24} color={color} />
          ),
        }}
      />
      
      {/* 4. Tombol Tengah (Kustom) */}
      <Tabs.Screen
        name="scan" // Anda perlu buat file 'scan.tsx'
        options={{
          title: '', // Tanpa teks
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#FFF', // Latar belakang putih
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 20, // Mengangkat tombol ke atas
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <Ionicons name="camera" size={30} color="#000" /> {/* Ikon hitam */}
            </View>
          ),
        }}
      />

      {/* 5. Tab Device (BARU) */}
      <Tabs.Screen
        name="device" // Menunjuk ke app/(tabs)/device.tsx
        options={{
          title: 'Device',
          tabBarIcon: ({ color }) => (
            <Ionicons name="phone-portrait" size={24} color={color} />
          ),
        }}
      />
      
      {/* 6. Tab Consultation (BARU) */}
      <Tabs.Screen
        name="consultation" // Menunjuk ke app/(tabs)/consultation.tsx
        options={{
          title: 'Consultation',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={24} color={color} />
          ),
        }}
      />
      
      {/* 7. Tab Community (BARU) */}
      <Tabs.Screen
        name="community" // Menunjuk ke app/(tabs)/community.tsx
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}