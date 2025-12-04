import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

// 1. GANTI IMPORT NAVIGASI: Gunakan router dari expo-router
import { router } from "expo-router";

// Pastikan path ini benar (Naik 1 level dari screens ke utils)
import { sendImage } from "../utils/api";

export default function CameraScreen() {
  // HAPUS: const navigation = useNavigation... (Tidak dipakai di Expo Router)

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Cek Permission
  useEffect(() => {
    if (permission && !permission.granted) {
      // Logic tambahan jika perlu
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20, color: "white" }}>
          Butuh akses kamera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePictureAndSend = async () => {
    console.log("Tombol ditekan! Mencoba ambil gambar...");

    if (!cameraRef.current) {
      Alert.alert(
        "Error",
        "Kamera belum siap (Ref null). Coba restart aplikasi."
      );
      return;
    }

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        skipProcessing: true,
      });

      console.log("Foto berhasil diambil:", photo?.uri);

      if (!photo) throw new Error("Gagal mengambil gambar");

      // Resize
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 600 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Upload ke API
      const result = await sendImage(manipResult.uri);

      setLoading(false);

      // 2. GANTI CARA PINDAH HALAMAN:
      // Di Expo Router, kita gunakan router.push ke path file result
      // Data objek (result) harus di-stringify karena params URL berbentuk string
      router.push({
        pathname: "./app/result", // Pastikan file app/result.tsx sudah dibuat
        params: {
          data: JSON.stringify(result), // Ubah objek jadi string JSON
          photoUri: manipResult.uri,
        },
      });
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      Alert.alert("Error", err.message || "Gagal memproses foto");
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. KAMERA */}
      <CameraView
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        facing="back"
        onCameraReady={() => {
          console.log("Kamera Siap!");
          setIsCameraReady(true);
        }}
      />

      {/* 2. UI TOMBOL */}
      <View style={styles.controlsContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.captureButton, loading && styles.disabledButton]}
          onPress={takePictureAndSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1e90ff" />
          ) : (
            <View style={styles.innerCircle} />
          )}
        </TouchableOpacity>

        <Text style={styles.hintText}>
          {loading ? "Menganalisis..." : "Tekan untuk Scan"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 20,
  },
  innerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  hintText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
