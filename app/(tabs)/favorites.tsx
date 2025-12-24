import { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites] = useState<any[]>([]);

  const renderFavoriteCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-zinc-800 rounded-2xl overflow-hidden mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }}
      onPress={() => {
        if (item.type === "salon") {
          router.push(`/(salon-detail)/${item.id}` as any);
        } else {
          router.push(`/(stylist-detail)/${item.id}` as any);
        }
      }}
      activeOpacity={0.9}
    >
      <View className="relative">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-zinc-700 justify-center items-center">
            <Ionicons
              name={
                item.type === "salon" ? "storefront-outline" : "person-outline"
              }
              size={48}
              color="#71717a"
            />
          </View>
        )}
        {item.rating && (
          <View className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 flex-row items-center gap-1">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="text-xs font-bold text-gray-900">
              {item.rating}
            </Text>
          </View>
        )}
        <TouchableOpacity className="absolute top-3 right-3 bg-red-500 w-9 h-9 rounded-full justify-center items-center">
          <Ionicons name="heart" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-lg font-bold text-white mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="location-outline" size={14} color="#a1a1aa" />
          <Text className="text-sm text-zinc-400 flex-1" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        {item.specialty && (
          <Text className="text-xs text-zinc-500" numberOfLines={1}>
            {item.specialty}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-zinc-900">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="px-5 pt-12 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-white mb-1">
                Favorites
              </Text>
              <Text className="text-sm text-zinc-400">
                Your saved salons and stylists
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
              <Ionicons name="search-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-5">
          {favorites.length === 0 ? (
            <View className="py-20 justify-center items-center">
              <View className="w-20 h-20 bg-zinc-800 rounded-full justify-center items-center mb-4">
                <Ionicons name="heart-outline" size={40} color="#71717a" />
              </View>
              <Text className="text-xl font-bold text-white mb-2">
                No Favorites Yet
              </Text>
              <Text className="text-sm text-zinc-400 text-center mb-8 px-8">
                Start adding your favorite salons and stylists
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="bg-white px-6 py-3 rounded-full"
                  onPress={() => router.push("/(tabs)/")}
                >
                  <Text className="text-zinc-900 font-semibold">
                    Browse Salons
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-zinc-800 px-6 py-3 rounded-full"
                  onPress={() => router.push("/(tabs)/explore")}
                >
                  <Text className="text-white font-semibold">
                    Find Stylists
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {favorites.map((item) => (
                <View key={item.id}>
                  {renderFavoriteCard({ item })}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
