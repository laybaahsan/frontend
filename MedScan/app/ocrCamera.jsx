import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function OcrCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    setLoading(true);

    // Simulate OCR with dummy data
    setTimeout(() => {
      setLoading(false);

      const dummyMedicine = {
        name: "Panadol",
        company: "GSK Pharma",
        formula: "Paracetamol 500mg",
        instructions: "Take 1 tablet every 6-8 hours after meals",
      };

      router.push({
        pathname: "/medicine-detail",
        params: { medicine: dummyMedicine },
      });
    }, 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} />
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  button: { backgroundColor: "#001f54", padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    backgroundColor: "#001f54",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
