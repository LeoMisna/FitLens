import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function SettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State User Auth
  const [user, setUser] = useState(auth.currentUser);

  // State Form Profil
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">(""); // Tipe Gender
  const [photoUrl, setPhotoUrl] = useState("");

  // 1. Ambil data profil saat ini
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.displayName || user.displayName || "");
            setAge(data.age ? String(data.age) : "");
            // Pastikan gender cocok dengan opsi kita
            if (data.gender === "Male" || data.gender === "Female") {
              setGender(data.gender);
            }
            // GANTI DENGAN LINK BARU:
            setPhotoUrl(
              data.photoURL ||
                "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png"
            );
          }
        } catch (error) {
          console.error("Gagal ambil profil:", error);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  // 2. Fungsi Sign Out / Sign In
  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut(auth);
        Alert.alert("Signed Out", "Anda berhasil keluar.");
        router.replace("/signin");
      } catch (error) {
        Alert.alert("Error", "Gagal sign out.");
      }
    } else {
      router.replace("/signin");
    }
  };

  // 3. Fungsi Simpan Profil
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const docRef = doc(db, "users", user.uid);

      await setDoc(
        docRef,
        {
          displayName: name,
          age: age,
          gender: gender, // Simpan Male/Female
          photoURL: photoUrl,
        },
        { merge: true }
      );

      Alert.alert("Sukses", "Profil berhasil diperbarui!");
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan profil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Render untuk GUEST (Belum Login) ---
  const renderGuestView = () => (
    <View style={styles.guestContainer}>
      <Ionicons name="lock-closed-outline" size={80} color="#666" />
      <Text style={styles.guestTitle}>Akses Dibatasi</Text>
      <Text style={styles.guestSubtitle}>
        Silakan Sign In terlebih dahulu untuk mengubah profil dan pengaturan
        akun Anda.
      </Text>

      <TouchableOpacity
        style={[
          styles.authButton,
          { backgroundColor: "#66CDAA", marginTop: 30, width: "100%" },
        ]}
        onPress={handleAuthAction}
      >
        <Text style={styles.authButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  // --- Render untuk USER (Sudah Login) ---
  const renderUserForm = () => (
    <>
      {/* Foto Profil Preview */}
      <View style={styles.avatarContainer}>
        <Image
          // GANTI DENGAN LINK BARU:
          source={{
            uri:
              photoUrl ||
              "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.changePhotoText}>Edit Photo URL below</Text>
      </View>

      {/* Form Edit */}
      <Text style={styles.label}>Display Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nama Lengkap"
        placeholderTextColor="#666"
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="25"
            placeholderTextColor="#666"
          />
        </View>

        {/* [UBAH] Gender Picker (Male / Female Buttons) */}
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Male" && styles.genderButtonSelected,
              ]}
              onPress={() => setGender("Male")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Male" && styles.genderTextSelected,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Female" && styles.genderButtonSelected,
              ]}
              onPress={() => setGender("Female")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Female" && styles.genderTextSelected,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Avatar URL (Link Gambar)</Text>
      <TextInput
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="https://..."
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Tombol Sign Out */}
      <TouchableOpacity
        style={[styles.authButton, { backgroundColor: "#FF4444" }]}
        onPress={handleAuthAction}
      >
        <Text style={[styles.authButtonText, { color: "white" }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logika: Jika user ada, tampilkan form. Jika tidak, tampilkan guest view */}
        {user ? renderUserForm() : renderGuestView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },

  // Style Guest View
  guestContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  guestTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  guestSubtitle: {
    color: "#B0B0B0",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },

  // Style Form
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#333",
  },
  changePhotoText: { color: "#888", marginTop: 10, fontSize: 12 },
  label: { color: "#B0B0B0", marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },

  // [BARU] Style Gender Buttons
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
  }, // tinggi disamakan dengan input
  genderButton: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2, // Jarak antar tombol
  },
  genderButtonSelected: {
    backgroundColor: "#333", // Warna lebih terang saat dipilih
    borderColor: "#66CDAA", // Border hijau/teal saat dipilih
  },
  genderText: { color: "#666", fontWeight: "600" },
  genderTextSelected: { color: "#fff", fontWeight: "bold" },

  saveButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: { color: "black", fontWeight: "bold", fontSize: 16 },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 30 },

  authButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  authButtonText: { fontWeight: "bold", fontSize: 16, color: "white" },
});
