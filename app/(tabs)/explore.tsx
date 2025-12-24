import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useStylistsStore } from "@/stores/stylistsStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  "All",
  "Hair Color",
  "Cuts",
  "Extensions",
  "Styling",
  "Curly Hair",
];

export default function StylistsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredStylists, setFilteredStylists] = useState<any[]>([]);
  const { stylists, isLoading, error, fetchIndependentStylists } =
    useStylistsStore();

  useEffect(() => {
    fetchIndependentStylists();
  }, [fetchIndependentStylists]);

  useEffect(() => {
    let filtered = stylists;

    if (searchQuery) {
      filtered = filtered.filter(
        (stylist) =>
          stylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stylist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStylists(filtered);
  }, [searchQuery, stylists]);

  const handleStylistPress = (stylistId: string) => {
    router.push(`/(stylist-detail)/${stylistId}` as any);
  };

  const renderStylistCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-zinc-800 rounded-2xl overflow-hidden mb-4 mr-4"
      style={{
        width: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }}
      onPress={() => handleStylistPress(item.id)}
      activeOpacity={0.9}
    >
      <View className="relative">
        {item.avatar_url ? (
          <Image
            source={{ uri: item.avatar_url }}
            className="w-full h-44"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-44 bg-zinc-700 justify-center items-center">
            <Ionicons name="person-outline" size={48} color="#71717a" />
          </View>
        )}
        {item.rating && (
          <View className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 flex-row items-center gap-1">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="text-xs font-bold text-gray-900">
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}
        <TouchableOpacity className="absolute top-3 right-3 bg-white/90 w-8 h-8 rounded-full justify-center items-center">
          <Ionicons name="bookmark-outline" size={16} color="#18181b" />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-base font-bold text-white mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        {item.salon && (
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="storefront-outline" size={12} color="#a1a1aa" />
            <Text className="text-xs text-zinc-400" numberOfLines={1}>
              {item.salon.name}
            </Text>
          </View>
        )}
        {item.specialties && item.specialties.length > 0 && (
          <Text className="text-xs text-zinc-400 mb-2" numberOfLines={1}>
            {item.specialties[0]}
          </Text>
        )}
        {item.years_experience && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="briefcase-outline" size={12} color="#a1a1aa" />
            <Text className="text-xs text-zinc-400">
              {item.years_experience} years exp.
            </Text>
          </View>
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
                Find Your Stylist
              </Text>
              <Text className="text-sm text-zinc-400">
                Browse independent professionals
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1 flex-row items-center bg-zinc-800 rounded-2xl px-4 py-3">
              <Ionicons name="search-outline" size={20} color="#71717a" />
              <TextInput
                className="flex-1 ml-3 text-white text-sm"
                placeholder="Search stylists..."
                placeholderTextColor="#71717a"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity className="w-12 h-12 bg-zinc-800 rounded-2xl justify-center items-center">
              <Ionicons name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-white">Specialties</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-zinc-400">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                className={`mr-3 px-5 py-3 rounded-2xl ${
                  selectedCategory === category ? "bg-white" : "bg-zinc-800"
                }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === category
                      ? "text-zinc-900"
                      : "text-zinc-400"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Stylists Section */}
        <View className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-white">Top Stylists</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-zinc-400">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-20 justify-center items-center">
              <ActivityIndicator size="large" color="#fff" />
              <Text className="text-sm text-zinc-400 mt-4">
                Loading stylists...
              </Text>
            </View>
          ) : error ? (
            <View className="py-20 justify-center items-center px-5">
              <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
              <Text className="text-xl font-bold text-white mb-2 mt-4">
                Error Loading Data
              </Text>
              <Text className="text-sm text-zinc-400 text-center mb-4">
                {error}
              </Text>
              <TouchableOpacity
                className="bg-white px-6 py-3 rounded-full"
                onPress={fetchIndependentStylists}
              >
                <Text className="text-zinc-900 font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredStylists.length === 0 ? (
            <View className="py-20 justify-center items-center px-5">
              <Ionicons name="search-outline" size={48} color="#71717a" />
              <Text className="text-xl font-bold text-white mb-2 mt-4">
                No Stylists Found
              </Text>
              <Text className="text-sm text-zinc-400 text-center">
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {filteredStylists.map((stylist) => (
                <View key={stylist.id}>
                  {renderStylistCard({ item: stylist })}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
