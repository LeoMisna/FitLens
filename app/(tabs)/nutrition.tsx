// Di dalam file: app/(tabs)/nutrition.tsx

import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
} from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

// --- Tipe Data (Tidak berubah) ---
type GoalData = {
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
};
type MealEntry = {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
type TotalsData = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// --- Komponen MealItem (Tidak berubah) ---
// @ts-ignore
const MealItem = ({ type, calories }) => {
  const iconMap = {
    Breakfast: 'cafe-outline',
    Lunch: 'restaurant-outline',
    Dinner: 'pizza-outline',
    Snacks: 'ice-cream-outline',
  };
  // @ts-ignore
  const iconName = iconMap[type] || 'fast-food-outline';
  return (
    <View style={styles.mealItem}>
      <View style={[styles.mealIconContainer, { backgroundColor: '#333' }]}>
        <Ionicons name={iconName} size={24} color="#FFF" />
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealType}>{type}</Text>
        <Text style={styles.mealCalories}>{calories} kcal</Text>
      </View>
    </View>
  );
};

// --- Komponen GoalBar (Tidak berubah) ---
// @ts-ignore
const GoalBar = ({ label, current, goal, unit = 'g' }) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const displayPercentage = Math.min(percentage, 100); 
  return (
    <View style={styles.goalBarContainer}>
      <View style={styles.goalLabelRow}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalAmount}>
          {Math.round(current)}/{goal} {unit}
        </Text>
      </View>
      <View style={styles.goalBarBackground}>
        <View style={[styles.goalBarProgress, { width: `${displayPercentage}%` }]} />
      </View>
    </View>
  );
};

// --- Komponen Utama Halaman Nutrisi ---
export default function NutritionScreen() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<GoalData>({
    goalCalories: 2000,
    goalProtein: 100,
    goalCarbs: 100,
    goalFat: 100,
  });
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [totals, setTotals] = useState<TotalsData>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // [PERBAIKAN 1] Bungkus 'fetchData' dengan 'useCallback'
  // Fungsi ini bergantung pada state 'meals', jadi kita tambahkan 'meals'
  // ke dependency array-nya.
  const fetchData = useCallback(async (uid: string) => {
    if (meals.length === 0) {
      setLoading(true);
    }
    
    try {
      // 1. Ambil Goals
      const goalRef = doc(db, 'users', uid);
      const goalSnap = await getDoc(goalRef);
      if (goalSnap.exists()) {
        setGoals(goalSnap.data() as GoalData);
      } else {
        console.log("Belum ada dokumen 'Goals' untuk user ini, pakai default.");
      }

      // 2. Ambil Meals
      const today = new Date().toISOString().split('T')[0];
      const mealsQuery = query(
        collection(db, 'mealEntries'),
        where('userId', '==', uid),
        where('date', '==', today)
      );
      const mealsSnap = await getDocs(mealsQuery);
      
      // 3. Kalkulasi Total
      const mealsList: MealEntry[] = [];
      let totalCals = 0, totalPro = 0, totalCarbs = 0, totalFat = 0;

      mealsSnap.docs.forEach(doc => {
        const data = doc.data();
        const meal: MealEntry = {
          id: doc.id,
          type: data.type,
          calories: data.calories || 0,
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fat: data.fat || 0,
        };
        mealsList.push(meal);
        totalCals += meal.calories;
        totalPro += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
      });

      setMeals(mealsList);
      setTotals({
        calories: totalCals,
        protein: totalPro,
        carbs: totalCarbs,
        fat: totalFat,
      });

    } catch (error) {
      console.error("Error mengambil data nutrisi: ", error);
      Alert.alert("Gagal Memuat", "Tidak bisa mengambil data nutrisi.");
    } finally {
      setLoading(false);
    }
  }, [meals]); // <-- 'fetchData' bergantung pada 'meals'

  // 'useEffect' ini (tidak berubah)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        setMeals([]);
        setTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
      }
    });
    return () => unsubscribe();
  }, []); 

  
  // [PERBAIKAN 2] Tambahkan 'fetchData' ke dependency array di sini
  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchData(user.uid);
      } else {
        setLoading(false);
      }
    }, [fetchData]) // <-- Tambahkan 'fetchData' di sini
  );

  
  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER (Tidak berubah) --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <Link href="/addMeal" asChild>
          <TouchableOpacity>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* --- KONTEN (Tidak berubah) --- */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Today</Text>
          {meals.length > 0 ? (
            meals.map(meal => (
              <MealItem 
                key={meal.id} 
                type={meal.type} 
                calories={meal.calories} 
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada data makanan hari ini.</Text>
          )}

          <Text style={styles.sectionTitle}>Goals</Text>
          <GoalBar
            label="Calories"
            current={totals.calories}
            goal={goals.goalCalories}
            unit="kcal"
          />
          <GoalBar
            label="Protein"
            current={totals.protein}
            goal={goals.goalProtein}
          />
          <GoalBar
            label="Carbs"
            current={totals.carbs}
            goal={goals.goalCarbs}
          />
          <GoalBar
            label="Fat"
            current={totals.fat}
            goal={goals.goalFat}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// --- StyleSheet (Tidak berubah) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mealCalories: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  goalBarContainer: {
    marginBottom: 20,
  },
  goalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  goalLabel: {
    color: 'white',
    fontSize: 16,
  },
  goalAmount: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  goalBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden', 
  },
  goalBarProgress: {
    height: 8,
    backgroundColor: '#FFFFFF', 
    borderRadius: 4,
  },
});