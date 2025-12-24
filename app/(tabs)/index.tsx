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
  Alert,
} from "react-native";
import { useSalonsStore } from "@/stores/salonsStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const LOCATIONS = [
  "Alabama, USA",
  "New York, USA",
  "California, USA",
  "Texas, USA",
  "Florida, USA",
];
const CATEGORIES = ["All", "Haircut", "Shaves", "Hair Deals", "Nail Cut"];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Detecting...");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSalons, setFilteredSalons] = useState<any[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { salons, isLoading, error, fetchSalons } = useSalonsStore();

  useEffect(() => {
    fetchSalons();
    requestLocationPermission();
  }, [fetchSalons]);

  const requestLocationPermission = async () => {
    try {
      setIsDetectingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setSelectedLocation("Alabama, USA");
        Alert.alert(
          "Location Access",
          "Enable location access for better salon recommendations near you.",
          [
            { text: "Not Now", style: "cancel" },
            {
              text: "Enable",
              onPress: () => Location.requestForegroundPermissionsAsync(),
            },
          ]
        );
        setIsDetectingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.city && geocode.region) {
        const locationStr = `${geocode.city}, ${geocode.region}`;
        setSelectedLocation(locationStr);
      } else if (geocode.city) {
        setSelectedLocation(geocode.city);
      } else {
        setSelectedLocation("Alabama, USA");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setSelectedLocation("Alabama, USA");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    let filtered = salons;

    if (searchQuery) {
      filtered = filtered.filter(
        (salon) =>
          salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          salon.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Show all salons regardless of location for now
    // if (selectedLocation && selectedLocation !== "All Locations") {
    //   const locationParts = selectedLocation.split(",")[0].trim();
    //   filtered = filtered.filter(
    //     (salon) =>
    //       salon.city?.toLowerCase().includes(locationParts.toLowerCase()) ||
    //       salon.state?.toLowerCase().includes(locationParts.toLowerCase()) ||
    //       salon.address?.toLowerCase().includes(locationParts.toLowerCase())
    //   );
    // }

    setFilteredSalons(filtered);
  }, [salons, searchQuery, selectedLocation]);

  const handleSalonPress = (salonId: string) => {
    router.push(`/(salon-detail)/${salonId}` as any);
  };

  const renderSalonCard = ({ item }: { item: any }) => (
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
      onPress={() => handleSalonPress(item.id)}
      activeOpacity={0.9}
    >
      <View className="relative">
        {item.cover_image ? (
          <Image
            source={{ uri: item.cover_image }}
            className="w-full h-44"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-44 bg-zinc-700 justify-center items-center">
            <Ionicons name="storefront-outline" size={48} color="#71717a" />
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
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={12} color="#a1a1aa" />
          <Text className="text-xs text-zinc-400 flex-1" numberOfLines={1}>
            {item.address || "Location"}
          </Text>
        </View>
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
        {/* Header with Location */}
        <View className="px-5 pt-12 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                className="w-12 h-12 rounded-full"
              />
              <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={() => setShowLocationPicker(!showLocationPicker)}
              >
                <View>
                  <Text className="text-xs text-zinc-400 mb-0.5">Location</Text>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location" size={16} color="#fff" />
                    <Text className="text-sm font-semibold text-white">
                      {selectedLocation}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Location Picker */}
          {showLocationPicker && (
            <View className="bg-zinc-800 rounded-2xl mb-4 overflow-hidden">
              <TouchableOpacity
                className="px-4 py-3 border-b border-zinc-700 flex-row items-center gap-2"
                onPress={() => {
                  setShowLocationPicker(false);
                  requestLocationPermission();
                }}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="navigate" size={18} color="#ffffff" />
                )}
                <Text className="text-sm font-medium text-white flex-1">
                  {isDetectingLocation
                    ? "Detecting..."
                    : "Use Current Location"}
                </Text>
              </TouchableOpacity>
              {LOCATIONS.map((loc, index) => (
                <TouchableOpacity
                  key={loc}
                  className={`px-4 py-3 ${
                    index !== LOCATIONS.length - 1
                      ? "border-b border-zinc-700"
                      : ""
                  }`}
                  onPress={() => {
                    setSelectedLocation(loc);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text
                    className={`text-sm ${
                      selectedLocation === loc
                        ? "text-white font-semibold"
                        : "text-zinc-400"
                    }`}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Search Bar */}
          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1 flex-row items-center bg-zinc-800 rounded-2xl px-4 py-3">
              <Ionicons name="search-outline" size={20} color="#71717a" />
              <TextInput
                className="flex-1 ml-3 text-white text-sm"
                placeholder="Search salons..."
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
            <Text className="text-xl font-bold text-white">Categories</Text>
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

        {/* Best Salon Section */}
        <View className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-white">Best Salon</Text>
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
                Loading salons...
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
                onPress={fetchSalons}
              >
                <Text className="text-zinc-900 font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredSalons.length === 0 ? (
            <View className="py-20 justify-center items-center px-5">
              <Ionicons name="search-outline" size={48} color="#71717a" />
              <Text className="text-xl font-bold text-white mb-2 mt-4">
                No Salons Found
              </Text>
              <Text className="text-sm text-zinc-400 text-center">
                Try adjusting your location or search filters
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {filteredSalons.map((salon) => (
                <View key={salon.id}>{renderSalonCard({ item: salon })}</View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
