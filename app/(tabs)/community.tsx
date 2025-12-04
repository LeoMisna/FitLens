import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ==========================================
// 1. TIPE DATA & DUMMY DATA
// ==========================================

// Data untuk Forum
type ForumTopic = { id: string; title: string; posts: string; icon: string };
const FORUM_TOPICS: ForumTopic[] = [
  { id: "1", title: "Nutrition Tips", posts: "123 posts", icon: "#" },
  { id: "2", title: "Sleep Support", posts: "456 posts", icon: "#" },
  { id: "3", title: "General Health", posts: "789 posts", icon: "#" },
];

// Data untuk Social Feed
type SocialPost = {
  id: string;
  user: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  avatar: string;
};
const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "p1",
    user: "Liam Carter",
    time: "2d",
    content: "Just hit a new personal best on my run! #fitness",
    likes: 23,
    comments: 5,
    avatar: "https://i.pravatar.cc/150?u=liam",
  },
  {
    id: "p2",
    user: "Sophia Bennett",
    time: "1d",
    content: "Anyone else struggling with sleep lately? #health",
    likes: 15,
    comments: 8,
    avatar: "https://i.pravatar.cc/150?u=sophia",
  },
];

// Data untuk Leaderboard (Saya buatkan contoh data agar tampilannya bagus)
type LeaderboardUser = {
  id: string;
  rank: number;
  name: string;
  score: number;
  avatar: string;
};
const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    id: "1",
    rank: 1,
    name: "Sarah Connor",
    score: 2450,
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "2",
    rank: 2,
    name: "John Doe",
    score: 2300,
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "3",
    rank: 3,
    name: "Jane Smith",
    score: 2150,
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
  {
    id: "4",
    rank: 4,
    name: "Mike Ross",
    score: 1900,
    avatar: "https://i.pravatar.cc/150?u=mike",
  },
  {
    id: "5",
    rank: 5,
    name: "Rachel Zane",
    score: 1850,
    avatar: "https://i.pravatar.cc/150?u=rachel",
  },
  {
    id: "6",
    rank: 6,
    name: "Harvey Specter",
    score: 1700,
    avatar: "https://i.pravatar.cc/150?u=harvey",
  },
];

// ==========================================
// 2. KOMPONEN UTAMA (COMMUNITY SCREEN)
// ==========================================

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<
    "Forums" | "Leaderboard" | "Rewards"
  >("Forums");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER ATAS */}
      <View style={styles.header}>
        {/* Tombol back dummy (bisa dihapus/difungsikan jika perlu) */}
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* NAVIGASI TAB (Forums | Leaderboard | Rewards) */}
      <View style={styles.tabsContainer}>
        <TabButton
          title="Forums"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          title="Leaderboard"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          title="Rewards"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
      </View>

      {/* AREA KONTEN (Berubah sesuai Tab yang dipilih) */}
      <View style={styles.contentWrapper}>
        {activeTab === "Forums" && <ForumsView />}
        {activeTab === "Leaderboard" && <LeaderboardView />}
        {activeTab === "Rewards" && <RewardsView />}
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// 3. SUB-KOMPONEN (TAMPILAN PER HALAMAN)
// ==========================================

// --- A. Tampilan FORUMS ---
const ForumsView = () => {
  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Section Topik */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Forums</Text>
        {FORUM_TOPICS.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.forumCard}>
            <View style={styles.forumIconContainer}>
              <Text style={styles.forumIconText}>{topic.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.forumTitle}>{topic.title}</Text>
              <Text style={styles.forumStats}>{topic.posts}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Social Feed */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Social Feed</Text>
        {SOCIAL_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.userName}>{post.user}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postFooter}>
              <View style={styles.actionItem}>
                <Ionicons name="heart-outline" size={20} color="#CCC" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </View>
              <View style={styles.actionItem}>
                <Ionicons name="chatbubble-outline" size={20} color="#CCC" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// --- B. Tampilan LEADERBOARD (Disesuaikan Dark Mode) ---
const LeaderboardView = () => {
  const renderItem = ({ item }: { item: LeaderboardUser }) => {
    // Warna khusus untuk juara 1, 2, 3
    let rankColor = "#FFF";
    if (item.rank === 1) rankColor = "#FFD700"; // Emas
    else if (item.rank === 2) rankColor = "#C0C0C0"; // Perak
    else if (item.rank === 3) rankColor = "#CD7F32"; // Perunggu

    return (
      <View style={styles.leaderboardCard}>
        <Text style={[styles.rankText, { color: rankColor }]}>{item.rank}</Text>
        <Image source={{ uri: item.avatar }} style={styles.leaderboardAvatar} />
        <Text style={styles.leaderboardName}>{item.name}</Text>
        <Text style={styles.leaderboardScore}>{item.score} pts</Text>
      </View>
    );
  };

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.sectionTitle}>Weekly Top Users</Text>
      </View>
      <FlatList
        data={LEADERBOARD_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

// --- C. Tampilan REWARDS (Placeholder) ---
const RewardsView = () => (
  <View style={styles.centerPlaceholder}>
    <Ionicons name="gift-outline" size={60} color="#333" />
    <Text style={{ color: "#888", marginTop: 10 }}>Rewards Coming Soon</Text>
  </View>
);

// --- D. Komponen Tombol Tab ---
const TabButton = ({ title, activeTab, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tabItem, activeTab === title && styles.activeTabItem]}
    onPress={() => onPress(title)}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === title ? styles.activeTabText : styles.inactiveTabText,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// ==========================================
// 4. STYLING (DARK MODE)
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121413", // Background Utama Gelap
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#121413",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  // Tabs
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  tabItem: {
    marginRight: 25,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    borderBottomColor: "#FFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: { color: "#FFF" },
  inactiveTabText: { color: "#888" },

  // Content Area
  contentWrapper: { flex: 1 },
  scrollContainer: { flex: 1, paddingHorizontal: 20 },
  centerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: { marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },

  // Styles Forum
  forumCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2220",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  forumIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#2C3531",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  forumIconText: { fontSize: 20, color: "#FFF", fontWeight: "bold" },
  forumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  forumStats: { fontSize: 12, color: "#888" },

  // Styles Feed
  postCard: {
    backgroundColor: "#121413",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingBottom: 15,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  userName: { fontSize: 15, fontWeight: "bold", color: "#FFF", marginRight: 8 },
  postTime: { fontSize: 12, color: "#888" },
  postContent: {
    fontSize: 14,
    color: "#DDD",
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: { flexDirection: "row" },
  actionItem: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { fontSize: 13, color: "#CCC", marginLeft: 6 },

  // Styles Leaderboard
  leaderboardHeader: { marginTop: 20, marginBottom: 10 },
  leaderboardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2220",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
    marginRight: 10,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  leaderboardName: { flex: 1, fontSize: 16, color: "#FFF", fontWeight: "600" },
  leaderboardScore: { fontSize: 16, color: "#4CAF50", fontWeight: "bold" },
});
