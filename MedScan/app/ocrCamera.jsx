import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import axios from "axios";
import server from "../config/server";

export default function OcrCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);   // ref for capturing photo
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
    if (!cameraRef.current) return;
    setLoading(true);

    try {
      //  Take picture
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
 if (!photo.base64) throw new Error("Failed to capture image");
      // 🚀 Send image to backend
      const response = await axios.post(`${server}/medicine/scan-ocr`, {
        image: photo.base64,
      });

      setLoading(false);

      if (response.data && response.data.medicine) {
        // 👉 Navigate to medicine detail with fetched data
        router.push({
          pathname: "/medicine-detail",
          params: { name: response.data.medicine.name },
        });
      } else {
        Alert.alert("Not Found", "No matching medicine found in database.");
      }
    } catch (error) {
      setLoading(false);
      console.error("OCR Scan Error:", error);
      Alert.alert("Error", "Failed to scan medicine. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Attach ref to CameraView */}
      <CameraView ref={cameraRef} style={{ flex: 1 }} />

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
