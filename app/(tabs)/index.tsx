import { Ionicons } from '@expo/vector-icons'; // Untuk ikon settings
import { Image } from 'expo-image'; // Gunakan expo-image untuk performa
import { Link } from 'expo-router'; // [BARU] Impor Link untuk navigasi
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// -------------------------------------------------------------------
// [BARU] KOMPONEN KARTU INFO YANG BISA DIPAKAI ULANG
// -------------------------------------------------------------------
type InfoCardProps = {
  title: string;
  metric: string;
  subtext: string;
  imageUri: string;
};

const InfoCard = ({ title, metric, subtext, imageUri }: InfoCardProps) => (
  <View style={styles.card}>
    {/* Bagian Teks (Kiri) */}
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardMetric}>{metric}</Text>
      <Text style={styles.cardSubtext}>{subtext}</Text>
    </View>
    {/* Bagian Gambar (Kanan) */}
    <Image source={{ uri: imageUri }} style={styles.cardImage} />
  </View>
);

// -------------------------------------------------------------------
// [BARU] KOMPONEN UTAMA HOMESCREEN (DASHBOARD)
// -------------------------------------------------------------------
export default function HomeScreen() {
  const cardsData = [
    {
      title: 'Nutrition',
      metric: '2,100 cal',
      subtext: 'Remaining',
      imageUri: 'https://i.imgur.com/e1VdKoY.png', // Gambar brokoli
    },
    {
      title: 'Sleep',
      metric: '7h 30m',
      subtext: 'Last night',
      imageUri: 'https://i.imgur.com/xX83gBv.png', // Gambar tidur
    },
    {
      title: 'Activity',
      metric: '5,200 steps',
      subtext: 'Today',
      imageUri: 'https://i.imgur.com/mYvjSjG.png', // Gambar lari
    },
    {
      title: 'Activity',
      metric: '5,200 steps',
      subtext: 'Today',
      imageUri: 'https://i.imgur.com/mYvjSjG.png', // Gambar lari (duplikat)
    },
    {
      title: 'Activity',
      metric: '5,200 steps',
      subtext: 'Today',
      imageUri: 'https://i.imgur.com/mYvjSjG.png', // Gambar lari (duplikat)
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      {/* --- 1. HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* --- 2. KONTEN SCROLLABLE --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* --- 3. KARTU PROFIL --- */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://i.imgur.com/S5vPSsN.png' }} // Placeholder avatar
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Olivia Bennett</Text>
            <Text style={styles.profileDetails}>28, Female</Text>
            <Text style={styles.profileDetails}>San Francisco, CA</Text>
          </View>
        </View>

        {/* --- 4. DAFTAR KARTU INFO --- */}
        {cardsData.map((card, index) => (
          <InfoCard
            key={index} 
            title={card.title}
            metric={card.metric}
            subtext={card.subtext}
            imageUri={card.imageUri}
          />
        ))}

        {/* --- 5. [BARU] TOMBOL TES NAVIGASI KE SIGN IN --- */}
        <Link 
          href="/signin" // Href tetap di Link
          asChild // Beri tahu Link untuk meneruskan properti ke anak
        >
          <TouchableOpacity>
            {/* Style dan Teks sekarang ada di dalam <Text> */}
            <Text style={styles.testLink}> 
              (Tes) Kembali ke Sign In
            </Text>
          </TouchableOpacity>
        </Link>
        {/* --- AKHIR TOMBOL TES --- */}
        {/* --- AKHIR TOMBOL TES --- */}

      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------------------------------------------------------
// [BARU] STYLESHEET
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30, 
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    borderWidth: 2,
    borderColor: '#333',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileDetails: {
    color: '#B0B0B0', 
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#1E1E1E', 
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15, 
  },
  cardTitle: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  cardMetric: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  cardSubtext: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  cardImage: {
    width: 100,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#333', 
  },
  // [BARU] Style untuk tombol tes
  testLink: {
    fontSize: 18, 
    color: '#007AFF', // Warna link biru
    paddingVertical: 40, // Beri jarak banyak
    textAlign: 'center',
    fontWeight: 'bold' 
  },
});