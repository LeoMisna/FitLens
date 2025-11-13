import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
// [BARU] Impor fungsi otentikasi Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// [BARU] Impor 'auth' dari file config kita
import { auth } from '../firebaseConfig'; // <-- pastikan path ini benar

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // [DIUBAH] Kita buat fungsi ini 'async' untuk menunggu Firebase
  const handleSignUp = async () => {
    // Validasi sisi klien tetap kita lakukan
    if (username.length < 3) {
      Alert.alert('Gagal', 'Username minimal harus 3 karakter.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Gagal', 'Password minimal harus 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Gagal', 'Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    // --- Logika Firebase Dimulai ---
    try {
      // 1. Buat pengguna dengan email dan password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Simpan 'username' ke profil pengguna
      // [DIUBAH] Kita langsung gunakan 'userCredential.user'
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // 3. Beri tahu sukses...

      // 3. Beri tahu sukses dan pindah halaman
      Alert.alert(
        'Sukses',
        'Akun Anda berhasil dibuat. Silakan Sign In.',
        [{ text: 'OK', onPress: () => router.replace('/signin') }]
      );

    } catch (error: any) {
      // Tangani error dari Firebase
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Gagal', 'Email ini sudah terdaftar.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Gagal', 'Format email tidak valid.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Gagal', 'Password terlalu lemah.');
      } else {
        Alert.alert('Gagal', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Buat Akun</Text>
              <Text style={styles.subtitle}>
                Silakan mengisi data di bawah ini
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                keyboardAppearance="dark"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                autoCapitalize="none"
                keyboardAppearance="dark"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                keyboardAppearance="dark"
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Konfirmasi Password"
                placeholderTextColor="#888"
                secureTextEntry
                keyboardAppearance="dark"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleSignUp} // Panggil fungsi baru
            >
              <Text style={styles.loginButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- StyleSheet (Tidak berubah) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  topContainer: {
  },
  headerContainer: {
    alignItems: 'center', 
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 40,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
  },
  loginButton: {
    backgroundColor: '#2A3A3A',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#777',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});