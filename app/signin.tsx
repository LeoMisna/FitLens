import { Link, useRouter } from 'expo-router';
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
// [BARU] Impor fungsi sign-in Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
// [BARU] Impor 'auth' dari file config kita
import { auth } from '../firebaseConfig'; // <-- pastikan path ini benar

export default function SignInScreen() {
  // Kita tetap gunakan 'emailOrUsername' untuk state
  // tapi kita akan kirim ini sebagai 'email' ke Firebase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // [DIUBAH] Jadikan 'async' untuk menunggu Firebase
  const handleSignIn = async () => {
    // Peringatan: Logika ini HANYA akan berfungsi jika
    // pengguna memasukkan EMAIL mereka, bukan username.
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Gagal', 'Email dan Password harus diisi.');
      return;
    }

    // --- Logika Firebase Dimulai ---
    try {
      // Panggil Firebase untuk sign in
      await signInWithEmailAndPassword(auth, email, password);
      
      // Jika sukses (tidak ada error), Firebase akan otomatis
      // menyimpan sesi. Kita pindahkan user ke dashboard.
      router.replace('/(tabs)'); // Pindah ke homepage

    } catch (error: any) {
      // Tangani error login dari Firebase
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        Alert.alert('Login Gagal', 'Email atau Password salah.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Login Gagal', 'Format email tidak valid.');
      } else {
        Alert.alert('Login Gagal', 'Terjadi kesalahan. Coba lagi.');
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
              <Text style={styles.title}>Selamat Datang</Text>
              <Text style={styles.subtitle}>
                Silakan sign in dahulu untuk melanjutkan
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email/Username (Masukkan Email)" // [DIUBAH]
                placeholderTextColor="#888"
                keyboardAppearance="dark"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
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
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Belum ada akun? Silakan </Text>
              <Link href="/signup">
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Link>
            </View>
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  signUpLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});