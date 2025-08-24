import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet ,ActivityIndicator} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import server from "../config/server";


const MedicineDetail = ({ medicineName, onSave }) => {
   const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);


  
  // Fetch medicine from backend on mount
  useEffect(() => {
    if (!medicineName) return;

    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${server}/medicine/${medicineName}`);
        if (res.data) setMedicine(res.data);
        else Alert.alert("Not Found", "Medicine not found in database.");
      } catch (err) {
        console.error("Error fetching medicine:", err);
        Alert.alert("Error", "Failed to fetch medicine.");
      } finally {
        setLoading(false);
      }
    };
 fetchMedicine();
  }, [medicineName]);

  // Save medicine to backend + local
  const handleSavePress = async () => {
    if (!medicine) return;

    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Sign Up Required", "Please sign up to save medicines.");
        return;
      }

const parsedUser = JSON.parse(user);

      // Save to backend history
      await axios.post(`${server}/history/save`, {
        userId: parsedUser._id,
        medicine,
      });

      setSaved(true);
      Alert.alert("Success", "Medicine saved to history.");
    } catch (err) {
      console.error("Error saving medicine:", err);
      Alert.alert("Error", "Failed to save medicine.");
    }
  };

   // Copy medicine details
  const handleCopy = async () => {
    if (!medicine) return;

    await Clipboard.setStringAsync(
      `Name: ${medicine.name}
Company: ${medicine.company}
Formula: ${medicine.formula}
Instructions: ${medicine.instructions}
Side Effects: ${medicine.sideEffects}
Manufacturing: ${medicine.manufacturingDetails}`
    );

    Alert.alert("Success", "Medicine details copied to clipboard!");
  };
   if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#003087" />
      </View>
    );
  }

  if (!medicine) {
    return (
      <View style={styles.loader}>
        <Text>Medicine data not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{medicineName}</Text>
      <Text style={styles.detail}>Company Name: Example Pharma</Text>
      <Text style={styles.detail}>Medicine Formula: Sample Formula</Text>
      <Text style={styles.detail}>Instructions: Take one tablet daily.</Text>
      <Text style={styles.detail}>Side Effects: Nausea, dizziness.</Text>
      <Text style={styles.detail}>
        Manufacturing Details: Made in USA, 2025
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSavePress}>
          <Text style={styles.buttonText}>{saved ? "Saved" : "Save"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleCopy}>
          <Feather name="copy" size={24} color="#fff" />
        </TouchableOpacity>
        {/* 🚫 Share button removed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, color: "#000", fontWeight: "bold", marginBottom: 10 },
  detail: { fontSize: 16, color: "#000", marginBottom: 5 },
  buttonContainer: { flexDirection: "row", marginTop: 20 },
  button: {
    backgroundColor: "#003087",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  iconButton: {
    backgroundColor: "#003087",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default MedicineDetail;
