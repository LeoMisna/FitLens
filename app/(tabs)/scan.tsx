// app/(tabs)/scan.tsx
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CameraScreen from "../../src/screens/CameraScreen";
import ResultScreen from "../../src/screens/ResultScreen";

const Stack = createStackNavigator();

export default function ScanScreen() {
  return (
    <Stack.Navigator
      initialRouteName="CameraScreen"
      screenOptions={{
        headerShown: true, // Ini Header milik Stack (Food Scanner)
      }}
    >
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ title: "Food Scanner" }}
      />
      <Stack.Screen
        name="ResultScreen"
        component={ResultScreen}
        options={{ title: "Hasil Prediksi" }}
      />
    </Stack.Navigator>
  );
}
