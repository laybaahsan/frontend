import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (!user) {
          Alert.alert("Error", "First sign up, then you can view the history.");
          setSignedUp(false);
          return;
        }
        setSignedUp(true);

        const stored = await AsyncStorage.getItem("medicineHistory");
        if (stored) setHistory(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };

    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicine History</Text>
      {signedUp ? (
        history.length > 0 ? (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.details}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.text}>No history available.</Text>
        )
      ) : (
        <Text style={styles.text}>Please sign up to view your history.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 20, color: "#000", fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, color: "#000" },
  item: { marginBottom: 15, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 },
  name: { fontSize: 18, fontWeight: "bold", color: "#003087" },
  details: { fontSize: 14, color: "#555" },
});
