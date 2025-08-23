import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [user, setUser] = useState({ name: "", email: "", profileImage: "" });

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) return;
    setUser({ ...user, profileImage: result.assets[0].uri });
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    Alert.alert("Success", "Profile updated.");
  };

  return (
    <View style={styles.container}>
      {user.profileImage ? (
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />
      ) : null}
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Change Profile Image</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#003087",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  saveButton: { backgroundColor: "#003087", padding: 12, borderRadius: 8, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
