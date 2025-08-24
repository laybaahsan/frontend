import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import server from "../config/server"; // your backend URL

export default function ProfileScreen() {
const [user, setUser] = useState({ FirstName: "", LastName: "", email: "" });
const [loading, setLoading] = useState(false);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${server}/profile` , {withCredentials:true});
        setUser(res.data);
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Save updated profile to backend
  const saveProfile = async () => {
    try {
      const res = await axios.put(`${server}/profile`, user);
      setUser(res.data);
      Alert.alert("Success", "Profile updated.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#003087" style={{ flex: 1, justifyContent: "center" }} />;
  }

  // Get first letter of name for avatar
  const avatarLetter = user.FirstName ? user.FirstName[0].toUpperCase() : "U";

  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{avatarLetter}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={user.FirstName}
        onChangeText={(text) => setUser({ ...user, FirstName: text })}
      />
      <TextInput
  style={styles.input}
  placeholder="Last Name"
  value={user.LastName}
  onChangeText={(text) => setUser({ ...user, LastName: text })}
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#003087",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#003087",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
