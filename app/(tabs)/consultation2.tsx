import { Text, View } from 'react-native';

export default function ConsultationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ color: 'white' }}>Halaman Konsultasi</Text>
    </View>

    import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function ConsultationChat() {
  const scrollRef = useRef();

  const messages = [
    { id: 1, sender: "doctor", text: "Halo, ada keluhan apa hari ini?" },
    { id: 2, sender: "user", text: "Dok, saya akhir-akhir ini susah tidur." },
    { id: 3, sender: "doctor", text: "Baik, sudah berapa lama sulit tidurnya?" },
    { id: 4, sender: "user", text: "Kurang lebih 1 minggu dok." },
    { id: 5, sender: "doctor", text: "Baik, saya bantu analisis ya." }
  ];

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Konsultasi Dokter</Text>
      </View>

      {/* CHAT AREA */}
      <ScrollView
        style={styles.chatContainer}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === "user" ? styles.userBubble : styles.doctorBubble
            ]}
          >
            <Text style={styles.bubbleText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* INPUT AREA */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Text style={styles.sendText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d"
  },

  header: {
    padding: 15,
    backgroundColor: "#1b1b1b",
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  chatContainer: {
    flex: 1,
    padding: 15
  },

  bubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10
  },

  doctorBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2b2b"
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4a90e2"
  },

  bubbleText: {
    color: "white",
    fontSize: 15
  },

  inputWrapper: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1b1b1b"
  },

  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    color: "white"
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#4a90e2",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "center"
  },

  sendText: {
    color: "white",
    fontWeight: "600"
  }
});

  );
}