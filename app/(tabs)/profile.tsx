import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const getAvatarUrl = () => {
    // Check for Google profile picture
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // Check for email-based avatar (Gravatar)
    if (user?.email) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&size=200&background=7c3aed&color=ffffff&bold=true`;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-zinc-900 px-6 pt-16">
      {/* Header */}
      <View className="items-center mb-12">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-24 h-24 rounded-full mb-4"
            style={{ borderWidth: 3, borderColor: '#7c3aed' }}
          />
        ) : (
          <View className="w-24 h-24 bg-purple-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={48} color="white" />
          </View>
        )}
        <Text className="text-2xl font-bold text-white mb-1">
          {user?.user_metadata?.full_name || "User"}
        </Text>
        <Text className="text-base text-zinc-400">{user?.email}</Text>
      </View>

      {/* Profile Options */}
      <View className="bg-zinc-800 rounded-2xl overflow-hidden mb-6">
        <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-700">
          <Ionicons name="person-outline" size={24} color="#a855f7" />
          <Text className="text-white text-base ml-4 flex-1">Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-700">
          <Ionicons name="notifications-outline" size={24} color="#a855f7" />
          <Text className="text-white text-base ml-4 flex-1">
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4">
          <Ionicons name="settings-outline" size={24} color="#a855f7" />
          <Text className="text-white text-base ml-4 flex-1">Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="bg-red-600 py-4 rounded-2xl flex-row items-center justify-center"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text className="text-white text-center text-lg font-semibold ml-3">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
