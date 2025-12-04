import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. GANTI IMPORT: Gunakan hooks dari expo-router
import { router, useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  // 2. AMBIL PARAMETER DARI URL
  // Di Expo Router, params otomatis tersedia lewat hook ini
  const params = useLocalSearchParams();

  // 3. PARSE DATA
  // Karena data dikirim via URL sebagai string JSON, kita harus parse dulu
  let data = null;
  try {
    if (params.data) {
      data = JSON.parse(params.data as string);
    }
  } catch (e) {
    console.error("Gagal parsing data JSON:", e);
  }

  const photoUri = params.photoUri as string;

  // Jika data tidak ada (misal error parsing atau kosong)
  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Tidak ada data prediksi.</Text>
        <TouchableOpacity
          onPress={() => router.back()} // GANTI navigation.goBack()
          style={styles.buttonBack}
        >
          <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tampilkan Foto Makanan */}
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.title}>Hasil Analisis Gizi</Text>

      {/* Tabel Gizi Utama */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🔥 Kalori</Text>
          <Text style={styles.value}>
            {Number(data.calories || 0).toFixed(0)} kkal
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🥩 Protein</Text>
          <Text style={styles.value}>
            {Number(data.protein || 0).toFixed(1)} g
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🍞 Karbohidrat</Text>
          <Text style={styles.value}>
            {Number(data.carbs || 0).toFixed(1)} g
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🥑 Lemak</Text>
          <Text style={styles.value}>{Number(data.fat || 0).toFixed(1)} g</Text>
        </View>
      </View>

      {/* Detail Tambahan (Debug Info) */}
      <View style={styles.detailContainer}>
        <Text style={styles.subTitle}>Detail Lengkap (Raw Data):</Text>
        {Object.keys(data).map(
          (k) =>
            // Filter agar tidak menampilkan data gizi utama lagi
            ![
              "calories",
              "protein",
              "carbs",
              "fat",
              "name",
              "confidence",
            ].includes(k) && (
              <View style={styles.kv} key={k}>
                <Text style={styles.k}>{k}:</Text>
                <Text style={styles.v}>{String((data as any)[k])}</Text>
              </View>
            )
        )}
      </View>

      {/* Tombol Scan Lagi */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.back()} // GANTI navigation.goBack()
      >
        <Text style={styles.buttonText}>Scan Makanan Lain</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow untuk Android
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e90ff",
  },
  detailContainer: {
    width: "100%",
    marginTop: 10,
  },
  kv: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  k: { color: "#888", fontSize: 14 },
  v: { fontWeight: "500", fontSize: 14, color: "#333" },
  errorText: { fontSize: 18, marginBottom: 20, color: "red" },
  buttonBack: { backgroundColor: "#333", padding: 10, borderRadius: 8 },

  // Tombol Scan Lagi
  scanButton: {
    backgroundColor: "#1e90ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
