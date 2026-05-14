import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permissions, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!permissions) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permissions.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Camera access is required to take photos.
        </Text>
        <Pressable
          style={styles.button}
          onPress={async () => {
            const result = await requestPermission();
            if (!result.granted) {
              Alert.alert(
                "Camera Permission Required",
                "Please enable camera access in your device settings.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Settings", onPress: () => Linking.openSettings() },
                ],
              );
            }
          }}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync();
    if (!result?.uri) return;

    setPhoto(result.uri);
    await saveToGallery(result.uri);
  };

  const saveToGallery = async (uri: string) => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Photo Not Saved",
          "Media library permission is needed to save photos.",
          [
            { text: "OK", style: "cancel" },
            { text: "Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
      await MediaLibrary.createAssetAsync(uri);
    } finally {
      setSaving(false);
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewActions}>
          <Pressable style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.buttonText}>Retake</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>X</Text>
        </Pressable>
      </CameraView>
      <View style={styles.captureBar}>
        {saving ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  camera: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  captureBar: {
    height: 120,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  preview: { flex: 1, resizeMode: "contain" },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 24,
    gap: 16,
  },
  permissionText: { fontSize: 16, textAlign: "center", paddingHorizontal: 32 },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  primaryButton: { backgroundColor: "#208AEF" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
