import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

const MedicineDetail = ({ medicineName, onSave, saved }) => {

  const handleCopy = async () => {
    await Clipboard.setStringAsync(
      `${medicineName}\nCompany: Example Pharma\nFormula: Sample Formula`
    );
    Alert.alert("Success", "Medicine details copied to clipboard!");
  };

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync("", {
        dialogTitle: "Share Medicine Details",
        message: `${medicineName}\nCompany: Example Pharma\nFormula: Sample Formula`,
      });
    } else {
      Alert.alert("Error", "Sharing is not available on this device.");
    }
  };

  // ✅ Updated Save button to call onSave prop
  const handleSavePress = () => {
    if (onSave) {
      const medicine = {
        name: medicineName,
        details: "Company: Example Pharma | Formula: Sample Formula",
      };
      onSave(medicine);
    } else {
      Alert.alert("Error", "Save function not available.");
    }
  };

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
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Feather name="share" size={24} color="#fff" />
        </TouchableOpacity>
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
