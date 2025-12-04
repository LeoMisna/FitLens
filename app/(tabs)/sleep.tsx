// Di dalam file: app/(tabs)/sleep.tsx

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useFocusEffect, useRouter } from "expo-router"; // [PERBAIKAN] Tambahkan Link
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// [DIHAPUS] Import DateTimePicker sudah hilang
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// --- Tipe Data ---
type SleepData = {
  score: number;
  timeInBedInMinutes: number;
  totalSleepInMinutes: number;
  awakeInMinutes: number;
  deepInMinutes: number;
  lightInMinutes: number;
  remInMinutes: number;
};

type SleepSettings = {
  bedtime: string;
  wakeupTime: string;
  isAlarmOn: boolean;
  alarmTime: string;
};

// --- Helper: Format Menit ---
const formatTimeFromMinutes = (totalMinutes: number) => {
  if (isNaN(totalMinutes) || totalMinutes < 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// --- Komponen StatCard ---
// @ts-ignore
const StatCard = ({ title, value, style }) => (
  <View style={[styles.statCard, style]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// --- Komponen ProgressBar ---
// @ts-ignore
const ProgressBar = ({ progress, style = {} }) => (
  <View style={[styles.barBackground, style]}>
    <View style={[styles.barProgress, { width: `${progress}%` }]} />
  </View>
);

// --- Komponen StageBar ---
// @ts-ignore
const StageBar = ({ label, minutes, totalMinutes }) => {
  const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
  return (
    <View style={styles.stageRow}>
      <Text style={styles.stageLabel}>{label}</Text>
      <ProgressBar progress={percentage} style={{ flex: 1 }} />
    </View>
  );
};

// --- Setting Item (Kembali standar) ---
// @ts-ignore
const SettingItem = ({ icon, title, subtitle, value, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon} size={24} color="#FFF" />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    {value && <Text style={styles.settingValue}>{value}</Text>}
  </TouchableOpacity>
);

// --- Toggle Item ---
// @ts-ignore
const ToggleItem = ({ icon, title, subtitle, value, onToggle }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon} size={24} color="#FFF" />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={value ? "#FFF" : "#f4f3f4"}
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

// --- Navigation Item ---
// @ts-ignore
const NavigationItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon} size={24} color="#FFF" />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#888" />
  </TouchableOpacity>
);

// ==================================================================
// KOMPONEN UTAMA SCREEN
// ==================================================================
export default function SleepScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);

  const [settings, setSettings] = useState<SleepSettings>({
    bedtime: "22:00",
    wakeupTime: "06:00",
    isAlarmOn: true,
    alarmTime: "06:00",
  });

  // [DIHAPUS] State dan fungsi Picker dihapus agar aman

  const fetchData = useCallback(async (uid: string) => {
    setLoading(true);
    setSleepData(null);
    try {
      // 1. Data Harian
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const todayString = `${year}-${month}-${day}`;

      const q = query(
        collection(db, "sleepEntries"),
        where("userId", "==", uid),
        where("date", "==", todayString),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        setSleepData(querySnap.docs[0].data() as SleepData);
      }

      // 2. Data Settings
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.sleepSettings) {
          setSettings(userData.sleepSettings as SleepSettings);
        }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi Update Alarm ke Firebase
  const toggleAlarm = async (value: boolean) => {
    // Update UI Optimis
    setSettings({ ...settings, isAlarmOn: value });

    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          "sleepSettings.isAlarmOn": value,
        });
      } catch (error) {
        console.error("Gagal update alarm:", error);
        Alert.alert("Error", "Gagal menyimpan pengaturan alarm.");
        setSettings({ ...settings, isAlarmOn: !value }); // Rollback
      }
    }
  };

  // [BARU] Alert Sederhana saat diklik
  const showInfo = () => {
    Alert.alert(
      "Info",
      "Pengaturan waktu akan segera hadir di update berikutnya."
    );
  };

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchData(user.uid);
      } else {
        setLoading(false);
      }
    }, [fetchData])
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    const hasData = !!sleepData;
    const scoreText = hasData && sleepData!.score > 80 ? "Good" : "Fair";

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {hasData ? (
          <>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=600",
              }}
              style={styles.bannerImage}
            />
            <Text style={styles.sectionTitle}>Sleep Score</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreText}>{scoreText}</Text>
              <Text style={styles.scoreNumber}>{sleepData!.score}</Text>
            </View>
            <ProgressBar progress={sleepData!.score} />
            <Text style={styles.sectionTitle}>Sleep Analysis</Text>
            <View style={styles.statRow}>
              <StatCard
                title="Total Sleep"
                value={formatTimeFromMinutes(sleepData!.totalSleepInMinutes)}
                style={{ flex: 1, marginRight: 10 }}
              />
              <StatCard
                title="Time in Bed"
                value={formatTimeFromMinutes(sleepData!.timeInBedInMinutes)}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
            <StatCard
              title="Awake Time"
              value={formatTimeFromMinutes(sleepData!.awakeInMinutes)}
              style={{ width: "100%", marginTop: 20 }}
            />
            <Text style={styles.sectionTitle}>Sleep Stages</Text>
            <View style={styles.stageContainer}>
              <StageBar
                label="Deep"
                minutes={sleepData!.deepInMinutes}
                totalMinutes={sleepData!.totalSleepInMinutes}
              />
              <StageBar
                label="Light"
                minutes={sleepData!.lightInMinutes}
                totalMinutes={sleepData!.totalSleepInMinutes}
              />
              <StageBar
                label="REM"
                minutes={sleepData!.remInMinutes}
                totalMinutes={sleepData!.totalSleepInMinutes}
              />
              <StageBar
                label="Awake"
                minutes={sleepData!.awakeInMinutes}
                totalMinutes={sleepData!.timeInBedInMinutes}
              />
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.emptyText}>No sleep data for today.</Text>
            <Text style={styles.emptySubtext}>
              Sync device to see analysis.
            </Text>
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.recommendationText}>
          To improve your sleep, try to maintain a consistent sleep schedule.
        </Text>

        <Text style={styles.sectionTitle}>Sleep Schedule</Text>

        <View style={styles.scheduleBarContainer}>
          <Text style={styles.scheduleTimeLabel}>{settings.bedtime}</Text>
          <View style={styles.scheduleTrack}>
            <View style={styles.scheduleFill} />
          </View>
          <Text style={styles.scheduleTimeLabel}>{settings.wakeupTime}</Text>
        </View>
        <View style={styles.scheduleTimeLabelsRow}>
          <Text style={styles.smallLabel}>Bedtime</Text>
          <Text style={styles.smallLabel}>Wake Up</Text>
        </View>

        {/* --- PENGATURAN KEMBALI SEDERHANA (Tanpa Picker) --- */}
        <View style={styles.settingsContainer}>
          <SettingItem
            icon="moon"
            title="Bedtime"
            subtitle={settings.bedtime}
            value=""
            onPress={showInfo} // Tampilkan alert info saja
          />
          <SettingItem
            icon="sunny"
            title="Wake Up"
            subtitle={settings.wakeupTime}
            value=""
            onPress={showInfo}
          />

          <ToggleItem
            icon="alarm"
            title="Alarm"
            subtitle={settings.alarmTime}
            value={settings.isAlarmOn}
            onToggle={toggleAlarm}
          />
        </View>

        <Text style={styles.sectionTitle}>Sleep Manager</Text>
        <View style={styles.settingsContainer}>
          <NavigationItem
            icon="timer-outline"
            title="Set Sleep Goal"
            onPress={showInfo}
          />
          <NavigationItem
            icon="musical-notes-outline"
            title="Relaxation Music"
            onPress={() => router.push("/relaxation")}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER (Rata Kiri) --- */}
      <View style={styles.header}>
        {/* Hapus tombol back palsu dan spacer */}

        {/* Judul langsung di kiri */}
        <Text style={styles.headerTitle}>Sleep</Text>

        {/* Tombol Tambah di kanan */}
        {/* Pastikan href sesuai nama file Anda: /addSleep atau /newSleep */}
        <Link href="/newSleep" asChild>
          <TouchableOpacity>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {renderContent()}

      {/* Komponen Picker sudah dihapus */}
    </SafeAreaView>
  );
}

// --- StyleSheet (Sama) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
    fontSize: 28,
    fontWeight: "bold",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: { color: "white", fontSize: 18, fontWeight: "bold" },
  emptySubtext: { color: "#B0B0B0", fontSize: 14, marginTop: 5 },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  bannerImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  scoreText: { color: "white", fontSize: 18, fontWeight: "600" },
  scoreNumber: { color: "white", fontSize: 18, fontWeight: "bold" },
  barBackground: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  barProgress: { height: 8, backgroundColor: "#FFFFFF", borderRadius: 4 },
  statRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: { backgroundColor: "#1E1E1E", borderRadius: 15, padding: 20 },
  statTitle: { color: "#B0B0B0", fontSize: 14, marginBottom: 8 },
  statValue: { color: "white", fontSize: 24, fontWeight: "bold" },
  stageContainer: { backgroundColor: "#1E1E1E", borderRadius: 15, padding: 20 },
  stageRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  stageLabel: { color: "white", fontSize: 16, width: 60 },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 10 },
  recommendationText: { color: "#B0B0B0", fontSize: 14, lineHeight: 22 },
  scheduleBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  scheduleTrack: {
    flex: 1,
    height: "100%",
    marginHorizontal: 10,
    justifyContent: "center",
  },
  scheduleFill: {
    height: 20,
    backgroundColor: "#66CDAA",
    borderRadius: 4,
    width: "70%",
    alignSelf: "center",
  },
  scheduleTimeLabel: { color: "white", fontWeight: "bold", fontSize: 14 },
  scheduleTimeLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  smallLabel: { color: "#555", fontSize: 12 },
  settingsContainer: { marginTop: 10 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingTextContainer: { flex: 1 },
  settingTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  settingSubtitle: { color: "#B0B0B0", fontSize: 12, marginTop: 2 },
  settingValue: { color: "white", fontSize: 16, fontWeight: "bold" },
});
