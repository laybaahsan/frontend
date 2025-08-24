import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedicineDetail from "../components/MedicineDetail";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import server from "../config/server";

export default function MedicineDetailScreen() {
  const { name } = useLocalSearchParams();   // 🔥 backend me `name` field hai
  const [medicineData, setMedicineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Fetch medicine details from backend
  useEffect(() => {
    if (name) {
      axios
        .get(`${server}/medicine/${name}`)
        .then((res) => {
          setMedicineData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching medicine:", err);
          setLoading(false);
        });
    }
  }, [name]);

  // ✅ Save medicine history (to backend + local)
  const handleSave = async (medicine) => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Sign Up Required", "Please sign up before saving medicines.");
        return;
      }
      const parsedUser = JSON.parse(user);

      // Save in backend history
      await axios.post(`${server}/history/save`, {
        userId: parsedUser._id,
        medicine,
      });

      setSaved(true);
      Alert.alert("Success", "Medicine saved to history.");
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003087" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {medicineData && (
        <MedicineDetail
          medicine={medicineData}   //  ab complete object pass karenge
          onSave={handleSave}
          saved={saved}
        />
      )}
    </View>
  );
}
