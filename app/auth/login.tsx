import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      <View className="flex-1 px-6 pt-16 pb-8">
        {/* Header */}
        <TouchableOpacity className="mb-8" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View className="mb-12">
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </Text>
          <Text className="text-lg text-zinc-400">Sign in to continue</Text>
        </View>

        {/* Google Sign In */}
        <TouchableOpacity
          className="bg-white py-4 rounded-xl mb-8 flex-row items-center justify-center"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Ionicons name="logo-google" size={24} color="#000" />
          <Text className="text-black text-center text-lg font-semibold ml-3">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-zinc-700" />
          <Text className="text-zinc-500 mx-4">or</Text>
          <View className="flex-1 h-px bg-zinc-700" />
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-white text-sm font-medium mb-2">Email</Text>
          <TextInput
            className="bg-zinc-800 text-white px-4 py-4 rounded-xl border border-zinc-700"
            placeholder="Enter your email"
            placeholderTextColor="#71717a"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-white text-sm font-medium mb-2">Password</Text>
          <View className="relative">
            <TextInput
              className="bg-zinc-800 text-white px-4 py-4 rounded-xl border border-zinc-700 pr-12"
              placeholder="Enter your password"
              placeholderTextColor="#71717a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#71717a"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity className="mb-8">
          <Text className="text-purple-500 text-right">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          className="bg-purple-600 py-4 rounded-xl mb-6"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className="text-zinc-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text className="text-purple-500 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
