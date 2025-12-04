import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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
} from "react-native";

// Impor Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// --- Tipe Data ---
type DeviceItem = {
  id: string;
  name: string;
  status: string;
  isConnected: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

// --- Data Default ---
const DEFAULT_DEVICES: DeviceItem[] = [
  {
    id: "scale",
    name: "Smart Scale",
    status: "Last synced 2 hours ago",
    isConnected: true,
    icon: "speedometer-outline",
  },
  {
    id: "watch",
    name: "Smart Watch",
    status: "Last synced 1 hour ago",
    isConnected: true,
    icon: "watch-outline",
  },
  {
    id: "headset",
    name: "Headset",
    status: "Last synced 30 minutes ago",
    isConnected: true,
    icon: "headset-outline",
  },
  {
    id: "ring",
    name: "Smart Ring",
    status: "Connect your smart ring",
    isConnected: false,
    icon: "ellipse-outline",
  },
  {
    id: "shoes",
    name: "Smart Shoes",
    status: "Connect your smart shoes",
    isConnected: false,
    icon: "footsteps-outline",
  },
];

export default function DeviceScreen() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<DeviceItem[]>(DEFAULT_DEVICES);

  // --- Fungsi Fetch Data ---
  const fetchData = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.connectedDevices) {
          setDevices(userData.connectedDevices as DeviceItem[]);
        } else {
          await updateDoc(userRef, { connectedDevices: DEFAULT_DEVICES });
          setDevices(DEFAULT_DEVICES);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fungsi Connect/Disconnect ---
  const toggleDevice = async (item: DeviceItem) => {
    const user = auth.currentUser;
    if (!user) return;

    const newStatus = !item.isConnected;
    const newStatusText = newStatus
      ? "Just synced"
      : `Connect your ${item.name.toLowerCase()}`;

    const updatedDevices = devices.map((d) =>
      d.id === item.id
        ? { ...d, isConnected: newStatus, status: newStatusText }
        : d
    );
    setDevices(updatedDevices);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { connectedDevices: updatedDevices });
      Alert.alert(
        "Sukses",
        `${item.name} ${newStatus ? "terhubung" : "diputus"}.`
      );
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan status perangkat.");
    }
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

  // --- Komponen Item Perangkat ---
  const DeviceRow = ({ item }: { item: DeviceItem }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => toggleDevice(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={24} color="#B0B0B0" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceStatus}>{item.status}</Text>
      </View>

      <View style={styles.actionIcon}>
        {item.isConnected ? (
          <Ionicons name="checkmark" size={24} color="#FFF" />
        ) : (
          <Ionicons name="add" size={28} color="#FFF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER (DIUBAH) --- */}
      {/* Tombol back dihapus, judul sekarang rata kiri */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Devices</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          {devices.filter((d) => d.isConnected).length > 0 ? (
            devices
              .filter((d) => d.isConnected)
              .map((item) => <DeviceRow key={item.id} item={item} />)
          ) : (
            <Text style={styles.emptyText}>No devices connected.</Text>
          )}

          <View style={{ height: 20 }} />

          <Text style={styles.sectionTitle}>Available Devices</Text>
          {devices
            .filter((d) => !d.isConnected)
            .map((item) => (
              <DeviceRow key={item.id} item={item} />
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// --- StyleSheet (Perbaikan pada bagian 'header') ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    // [PERBAIKAN] Duplikat dihapus
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 60,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    // alignSelf: 'flex-start', // Opsional: pastikan rata kiri
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#2A3A3A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  deviceName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  deviceStatus: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  actionIcon: {
    marginLeft: 10,
  },
});
