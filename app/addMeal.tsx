// Di dalam file: app/modal.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// [BARU] Impor Firebase
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // <-- Sesuaikan path jika perlu

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export default function AddMealModal() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // [BARU] State untuk formulir
  const [selectedType, setSelectedType] = useState<MealType>('Breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // [BARU] Fungsi Backend untuk menyimpan data
  const handleSaveMeal = async () => {
    // Validasi sederhana
    if (!calories) {
      Alert.alert('Gagal', 'Kalori wajib diisi.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'Anda harus login untuk menambah data.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Siapkan data untuk dikirim ke Firestore
      const mealData = {
        userId: currentUser.uid,
        date: new Date().toISOString().split('T')[0], // Format 'YYYY-MM-DD'
        createdAt: Timestamp.now(), // Untuk sorting jika perlu
        type: selectedType,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      };

      // 2. Kirim data ke koleksi 'mealEntries'
      const docRef = await addDoc(collection(db, 'mealEntries'), mealData);
      
      console.log('Dokumen berhasil ditulis dengan ID: ', docRef.id);
      Alert.alert('Sukses', 'Data makanan berhasil disimpan.');
      router.back(); // Tutup modal setelah sukses

    } catch (error) {
      console.error('Error menambah dokumen: ', error);
      Alert.alert('Error', 'Gagal menyimpan data ke server.');
    } finally {
      setIsSaving(false);
    }
  };

  // [BARU] Komponen UI untuk pemilih tipe makanan
  const MealTypePicker = () => (
    <View style={styles.pickerContainer}>
      {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealType[]).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.pickerButton,
            selectedType === type && styles.pickerButtonSelected,
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text
            style={[
              styles.pickerText,
              selectedType === type && styles.pickerTextSelected,
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Paksa status bar jadi terang karena background kita gelap */}
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* --- 1. Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Meal</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- 2. Formulir --- */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Meal Type</Text>
          <MealTypePicker />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500 kcal"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
          
          <Text style={styles.label}>Macros (Optional)</Text>
          <View style={styles.macroRow}>
            <TextInput
              style={styles.inputMacro}
              placeholder="Protein (g)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
            <TextInput
              style={styles.inputMacro}
              placeholder="Carbs (g)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />
            <TextInput
              style={styles.inputMacro}
              placeholder="Fat (g)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={fat}
              onChangeText={setFat}
            />
          </View>

          {/* --- 3. Tombol Save --- */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveMeal}
            disabled={isSaving} // Tombol tidak bisa ditekan saat sedang menyimpan
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  // Style untuk Pemilih Tipe Makanan
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pickerButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  pickerText: {
    color: '#FFF',
  },
  pickerTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  // Style untuk Input Teks
  input: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputMacro: {
    flex: 1, // Agar 3 input berbagi ruang
    backgroundColor: '#1E1E1E',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#555',
    marginHorizontal: 4,
  },
  // Style untuk Tombol Save
  saveButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});