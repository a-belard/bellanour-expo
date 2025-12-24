import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-zinc-900 justify-between items-center"
      style={styles.container}
    >
      {/* Logo and Brand */}
      <View className="items-center" style={styles.logoSection}>
        <View className="w-40 h-40 bg-white rounded-full items-center justify-center mb-6">
          <Ionicons name="cut" size={80} color="#7c3aed" />
        </View>
        <Text className="text-7xl font-bold text-white tracking-wide">
          Bellanour
        </Text>
      </View>

      {/* Auth Buttons */}
      <View className="w-full px-8" style={styles.buttonSection}>
        <TouchableOpacity
          className="py-5 rounded-full mb-5 border-2"
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-5 rounded-full"
          style={styles.registerButton}
          onPress={() => router.push("/auth/signup")}
        >
          <Text className="text-white text-center text-lg font-bold">
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingBottom: 60,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
  },
  buttonSection: {
    paddingBottom: 20,
  },
  loginButton: {
    backgroundColor: "rgba(63, 63, 70, 0.6)",
    borderColor: "rgba(161, 161, 170, 0.5)",
  },
  registerButton: {
    backgroundColor: "#7c3aed",
  },
});
