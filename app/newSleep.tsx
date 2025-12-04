import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function AddSleepModal() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [score, setScore] = useState("");
  const [totalSleep, setTotalSleep] = useState("");
  const [awake, setAwake] = useState("");
  const [deep, setDeep] = useState("");
  const [light, setLight] = useState("");
  const [rem, setRem] = useState("");

  const handleSave = async () => {
    if (!score || !totalSleep || !awake) {
      Alert.alert("Gagal", "Wajib isi Score, Total Sleep, & Awake.");
      return;
    }
    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);
    try {
      const dateObj = new Date();
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      const todayString = `${y}-${m}-${d}`;

      await addDoc(collection(db, "sleepEntries"), {
        userId: user.uid,
        date: todayString,
        createdAt: Timestamp.now(),
        score: Number(score) || 0,
        timeInBedInMinutes: (Number(totalSleep) || 0) + (Number(awake) || 0),
        totalSleepInMinutes: Number(totalSleep) || 0,
        awakeInMinutes: Number(awake) || 0,
        deepInMinutes: Number(deep) || 0,
        lightInMinutes: Number(light) || 0,
        remInMinutes: Number(rem) || 0,
      });

      Alert.alert("Sukses", "Data tersimpan!");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Gagal simpan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Sleep</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Score (0-100)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={score}
          onChangeText={setScore}
          placeholder="85"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Total Sleep (mins)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={totalSleep}
          onChangeText={setTotalSleep}
          placeholder="450"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Awake Time (mins)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={awake}
          onChangeText={setAwake}
          placeholder="30"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Deep / Light / REM (mins)</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Deep"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={deep}
            onChangeText={setDeep}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Light"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={light}
            onChangeText={setLight}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="REM"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={rem}
            onChangeText={setRem}
          />
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.btnText}>{isSaving ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  form: { padding: 20 },
  label: { color: "#ccc", marginTop: 15, marginBottom: 5 },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  btn: {
    backgroundColor: "#66CDAA",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  btnText: { fontWeight: "bold", fontSize: 16 },
});
