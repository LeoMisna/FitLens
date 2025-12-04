import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router"; // useRouter untuk navigasi
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// --- Tipe Data ---
type UserProfile = {
  displayName: string;
  age: string;
  gender: string;
  photoURL: string;
};

type DashboardData = {
  nutritionCal: number; // Kalori tersisa atau terkonsumsi
  nutritionGoal: number;
  sleepHours: number;
  sleepMinutes: number;
};

// --- Komponen Kartu Info ---
type InfoCardProps = {
  title: string;
  metric: string;
  subtext: string;
  imageUri: string;
};

const InfoCard = ({ title, metric, subtext, imageUri }: InfoCardProps) => (
  <View style={styles.card}>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardMetric}>{metric}</Text>
      <Text style={styles.cardSubtext}>{subtext}</Text>
    </View>
    <Image source={{ uri: imageUri }} style={styles.cardImage} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State Data User
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: "Guest",
    age: "-",
    gender: "-",
    // GUNAKAN LINK BARU INI:
    photoURL:
      "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png",
  });

  // State Data Aktivitas
  const [data, setData] = useState<DashboardData>({
    nutritionCal: 0,
    nutritionGoal: 2000,
    sleepHours: 0,
    sleepMinutes: 0,
  });

  // --- Fungsi Fetch Semua Data ---
  const fetchDashboardData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // 1. Ambil Profil User & Goals
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let goalCals = 2000; // Default

      if (userSnap.exists()) {
        const d = userSnap.data();
        setUserProfile({
          displayName: d.displayName || "User",
          age: d.age ? String(d.age) : "-",
          gender: d.gender || "-",
          // GUNAKAN LINK BARU INI SEBAGAI CADANGAN (FALLBACK):
          photoURL:
            d.photoURL ||
            "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png",
        });
        if (d.goalCalories) goalCals = d.goalCalories;
      }

      // 2. Hitung Nutrisi Hari Ini (Calories Remaining)
      const today = new Date().toISOString().split("T")[0];
      const mealQ = query(
        collection(db, "mealEntries"),
        where("userId", "==", user.uid),
        where("date", "==", today)
      );
      const mealSnap = await getDocs(mealQ);
      let totalEaten = 0;
      mealSnap.forEach((doc) => {
        totalEaten += doc.data().calories || 0;
      });

      // Hitung Remaining (Target - Dimakan)
      // Jika makan lebih dari target, bisa negatif atau 0
      const remaining = goalCals - totalEaten;

      // 3. Ambil Data Tidur Hari Ini (Data yang benar dari Sleep Page)
      const dateObj = new Date();
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      const todayString = `${y}-${m}-${d}`; // Gunakan format lokal yang benar

      const sleepQ = query(
        collection(db, "sleepEntries"),
        where("userId", "==", user.uid),
        where("date", "==", todayString) // Sesuaikan dengan logika di sleep.tsx
      );
      const sleepSnap = await getDocs(sleepQ);

      let sleepMinsTotal = 0;
      if (!sleepSnap.empty) {
        // Ambil total durasi tidur (bukan waktu di kasur)
        sleepMinsTotal = sleepSnap.docs[0].data().totalSleepInMinutes || 0;
      }

      // Konversi menit ke jam/menit
      const sHours = Math.floor(sleepMinsTotal / 60);
      const sMins = sleepMinsTotal % 60;

      // Set State Akhir
      setData({
        nutritionCal: remaining,
        nutritionGoal: goalCals,
        sleepHours: sHours,
        sleepMinutes: sMins,
      });
    } catch (e) {
      console.error("Error fetching dashboard:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data setiap kali layar fokus (misal setelah edit profile)
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>

        {/* Tombol Pengaturan (Menuju /settings) */}
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- KARTU PROFIL DINAMIS --- */}
          <View style={styles.profileCard}>
            <Image
              source={{ uri: userProfile.photoURL }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.displayName}</Text>
              <Text style={styles.profileDetails}>
                {userProfile.age} yo, {userProfile.gender}
              </Text>
              <Text style={styles.profileDetails}>Fitness Enthusiast</Text>
            </View>
          </View>

          {/* --- DATA NUTRISI REAL --- */}
          {/* Kita tulis manual komponennya agar bisa memasukkan data.nutritionCal */}
          <InfoCard
            title="Nutrition"
            metric={`${data.nutritionCal} cal`}
            subtext="Remaining"
            // [GANTI GAMBAR] Menggunakan Unsplash (Makanan Sehat)
            imageUri="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400"
          />

          {/* --- DATA TIDUR REAL --- */}
          {/* Kita tulis manual agar bisa memasukkan data.sleepHours */}
          <InfoCard
            title="Sleep"
            metric={`${data.sleepHours}h ${data.sleepMinutes}m`}
            subtext="Last night"
            // [GANTI GAMBAR] Menggunakan Unsplash (Malam/Bulan)
            imageUri="https://images.unsplash.com/photo-1511295742362-92c96b1cf484?q=80&w=400"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "#333",
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  profileDetails: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  cardMetric: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  cardSubtext: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  cardImage: {
    width: 100,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#333",
  },
});
