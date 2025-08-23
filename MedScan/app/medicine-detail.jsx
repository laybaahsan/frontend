import React, { useState } from "react";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedicineDetail from "../components/MedicineDetail";
import { useLocalSearchParams } from "expo-router";

export default function MedicineDetailScreen() {
  const { medicineName } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);

  const handleSave = async (medicine) => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Sign Up Required", "Please sign up before saving medicines.");
        return;
      }

      const stored = await AsyncStorage.getItem("medicineHistory");
      const history = stored ? JSON.parse(stored) : [];

      // ✅ Prevent duplicate entries
      const exists = history.some((item) => item.name === medicine.name);
      if (!exists) {
        history.push(medicine);
        await AsyncStorage.setItem("medicineHistory", JSON.stringify(history));
        setSaved(true);
        Alert.alert("Success", "Medicine saved to history.");
      } else {
        Alert.alert("Info", "Medicine already saved in history.");
      }
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MedicineDetail
        medicineName={medicineName || "Unknown"}
        onSave={handleSave}
        saved={saved}
      />
    </View>
  );
}
