// Di dalam file: app/(tabs)/sleep.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

// --- Tipe Data (Tidak berubah) ---
type SleepData = {
  score: number;
  timeInBedInMinutes: number;
  totalSleepInMinutes: number;
  awakeInMinutes: number;
  deepInMinutes: number;
  lightInMinutes: number;
  remInMinutes: number;
};

// --- Helper: Format Waktu (Tidak berubah) ---
const formatTimeFromMinutes = (totalMinutes: number) => {
  if (isNaN(totalMinutes) || totalMinutes < 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// --- Komponen StatCard (Tidak berubah) ---
// @ts-ignore
const StatCard = ({ title, value, style }) => (
  <View style={[styles.statCard, style]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// --- Komponen ProgressBar (Sudah diperbaiki) ---
// @ts-ignore
const ProgressBar = ({ progress, style = {} }) => ( // [PERBAIKAN] 'style' dibuat opsional
  <View style={[styles.barBackground, style]}>
    <View style={[styles.barProgress, { width: `${progress}%` }]} />
  </View>
);

// --- Komponen StageBar (Tidak berubah) ---
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

// --- Komponen Utama Halaman Sleep ---
export default function SleepScreen() {
  const [loading, setLoading] = useState(true);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);

  const fetchData = useCallback(async (uid: string) => {
    setLoading(true);
    setSleepData(null); 
    try {
      
      // --- [PERBAIKAN LOGIKA TANGGAL] ---
      // Hapus: const today = new Date().toISOString().split('T')[0];
      // Ganti dengan ini:
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // +1 karena bulan 0-indexed
      const day = String(dateObj.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;
      
      // Sekarang 'todayString' akan menjadi "2025-11-14" (WIB)
      // bukan "2025-11-13" (UTC)
      // --- AKHIR PERBAIKAN ---

      const q = query(
        collection(db, 'sleepEntries'),
        where('userId', '==', uid),
        where('date', '==', todayString), // Gunakan string tanggal yang benar
        limit(1) 
      );

      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        console.log(`Tidak ada data tidur untuk: ${todayString}`); // Log untuk debug
        setSleepData(null);
      } else {
        setSleepData(querySnap.docs[0].data() as SleepData);
      }
    } catch (error) {
      console.error("Error mengambil data tidur: ", error);
      Alert.alert("Gagal Memuat", "Tidak bisa mengambil data tidur.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchData(user.uid);
      } else {
        setLoading(false);
        setSleepData(null);
      }
    }, [fetchData])
  );

  // --- renderContent() (Tidak berubah) ---
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    if (!sleepData) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>No sleep data recorded for today.</Text>
          <Text style={styles.emptySubtext}>
            Sync your device or add an entry to see your analysis.
          </Text>
        </View>
      );
    }

    const scoreText = sleepData.score > 80 ? 'Good' : 'Fair'; 

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: 'https://i.imgur.com/xX83gBv.png' }} 
          style={styles.bannerImage}
        />
        <Text style={styles.sectionTitle}>Sleep Score</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>{scoreText}</Text>
          <Text style={styles.scoreNumber}>{sleepData.score}</Text>
        </View>
        <ProgressBar progress={sleepData.score} />
        <Text style={styles.sectionTitle}>Sleep Analysis</Text>
        <View style={styles.statRow}>
          <StatCard
            title="Total Sleep"
            value={formatTimeFromMinutes(sleepData.totalSleepInMinutes)}
            style={{ flex: 1, marginRight: 10 }}
          />
          <StatCard
            title="Time in Bed"
            value={formatTimeFromMinutes(sleepData.timeInBedInMinutes)}
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
        <StatCard
          title="Awake Time"
          value={formatTimeFromMinutes(sleepData.awakeInMinutes)}
          style={{ width: '100%', marginTop: 20 }}
        />
        <Text style={styles.sectionTitle}>Sleep Stages</Text>
        <View style={styles.stageContainer}>
          <StageBar
            label="Deep"
            minutes={sleepData.deepInMinutes}
            totalMinutes={sleepData.totalSleepInMinutes}
          />
          <StageBar
            label="Light"
            minutes={sleepData.lightInMinutes}
            totalMinutes={sleepData.totalSleepInMinutes}
          />
          <StageBar
            label="REM"
            minutes={sleepData.remInMinutes}
            totalMinutes={sleepData.totalSleepInMinutes}
          />
          <StageBar
            label="Awake"
            minutes={sleepData.awakeInMinutes}
            totalMinutes={sleepData.timeInBedInMinutes} 
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER (Tidak berubah) --- */}
      <View style={styles.header}>
        <TouchableOpacity style={{ opacity: 0 }}> 
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep</Text>
        <View style={{ width: 28 }} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- StyleSheet (Tidak berubah) ---
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  scoreNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barProgress: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  statTitle: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stageContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stageLabel: {
    color: 'white',
    fontSize: 16,
    width: 60,
  },
});