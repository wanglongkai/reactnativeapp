import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-camera</Text>
      <Pressable
        style={styles.cameraButton}
        onPress={() => router.push("/camera")}
      >
        <Text style={styles.cameraButtonText}>Open Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: { fontSize: 24, fontWeight: "600" },
  cameraButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#208AEF",
  },
  cameraButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
