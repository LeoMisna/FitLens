import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image"; // Kita pakai expo-image agar gambar lebih cepat dimuat
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Tipe Data Dummy ---
type DummyItem = {
  id: string;
  title: string;
  imageUri: string;
  duration?: string; // Optional, hanya untuk track
};

// --- DATA DUMMY (Hardcoded untuk tampilan) ---
// Gunakan gambar dari Unsplash agar terlihat nyata
const DUMMY_PLAYLISTS: DummyItem[] = [
  {
    id: "p1",
    title: "Nature Sounds",
    imageUri:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400",
  },
  {
    id: "p2",
    title: "Ocean Waves",
    imageUri:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=400",
  },
  {
    id: "p3",
    title: "Mountain Rain",
    imageUri:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400",
  },
  {
    id: "p4",
    title: "Deep Sleep",
    imageUri:
      "https://images.unsplash.com/photo-1515871204537-49a5fe66a31f?q=80&w=400",
  },
];

const DUMMY_TRACKS: DummyItem[] = [
  {
    id: "t1",
    title: "Forest Whisper",
    duration: "4:32",
    imageUri:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200",
  },
  {
    id: "t2",
    title: "Gentle Surf",
    duration: "5:15",
    imageUri:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=200",
  },
  {
    id: "t3",
    title: "Soft Piano",
    duration: "3:45",
    imageUri:
      "https://images.unsplash.com/photo-1552422534-a03d4703676e?q=80&w=200",
  },
  {
    id: "t4",
    title: "Night Crickets",
    duration: "6:00",
    imageUri:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=200",
  },
  {
    id: "t5",
    title: "Rain on Window",
    duration: "2:30",
    imageUri:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=200",
  },
];

export default function RelaxationScreen() {
  const router = useRouter();

  // Fungsi saat item diklik (hanya alert dummy)
  const handleItemClick = (title: string, type: "playlist" | "track") => {
    Alert.alert(
      "Simulasi Dummy",
      `Anda mengklik ${type}: "${title}". \n(Fitur pemutar musik belum aktif)`
    );
  };

  // --- Render Item Playlist (Kotak Horizontal) ---
  const renderPlaylistCard = ({ item }: { item: DummyItem }) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() => handleItemClick(item.title, "playlist")}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.playlistImage}
        contentFit="cover"
        transition={500}
      />
      <Text style={styles.playlistTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // --- Render Item Track (Baris Vertikal) ---
  const renderTrackRow = (item: DummyItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.trackItem}
      onPress={() => handleItemClick(item.title, "track")}
      activeOpacity={0.7}
    >
      {/* Gambar Kecil di Kiri */}
      <Image
        source={{ uri: item.imageUri }}
        style={styles.trackImage}
        contentFit="cover"
        transition={500}
      />

      {/* Teks di Tengah */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackDuration}>{item.duration}</Text>
      </View>

      {/* Ikon Play di Kanan */}
      <Ionicons name="play-circle-outline" size={28} color="#B0B0B0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar agar ikon di atas menjadi putih */}
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relaxation Music</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Section 1: Featured Playlists (Horizontal Scroll) --- */}
        <Text style={styles.sectionTitle}>Featured Playlists</Text>
        <View>
          <FlatList
            data={DUMMY_PLAYLISTS}
            renderItem={renderPlaylistCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistListContainer}
          />
        </View>

        {/* --- Section 2: All Tracks (Vertical List) --- */}
        <Text style={styles.sectionTitle}>All Tracks</Text>
        <View style={styles.tracksContainer}>
          {DUMMY_TRACKS.map((track) => renderTrackRow(track))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Latar belakang gelap
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15,
  },

  // --- Styles untuk Playlist (Horizontal) ---
  playlistListContainer: {
    paddingHorizontal: 20,
  },
  playlistCard: {
    marginRight: 15,
    width: 140,
  },
  playlistImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#2A3A3A", // Placeholder color saat loading
  },
  playlistTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // --- Styles untuk Tracks (Vertical) ---
  tracksContainer: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#1E1E1E", // Latar belakang kartu track sedikit lebih terang
    padding: 12,
    borderRadius: 12,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#2A3A3A",
    marginRight: 15,
  },
  trackInfo: {
    flex: 1, // Mengisi ruang tengah
  },
  trackTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  trackDuration: {
    color: "#B0B0B0", // Abu-abu muda
    fontSize: 14,
  },
});
