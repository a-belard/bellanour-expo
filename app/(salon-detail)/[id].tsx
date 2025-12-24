import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import BookingDialog from "@/components/BookingDialog";

export default function SalonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [salon, setSalon] = useState<any>(null);
  const [stylists, setStylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchSalonData();
    }
  }, [id]);

  const fetchSalonData = async () => {
    try {
      setIsLoading(true);
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("*")
        .eq("id", id as string)
        .single();

      if (salonError) throw salonError;
      setSalon(salonData);

      const { data: stylistsData, error: stylistsError } = await supabase
        .from("stylists")
        .select("*")
        .eq("salon_id", id as string);

      if (!stylistsError) {
        setStylists(stylistsData || []);
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStylistPress = (stylistId: string) => {
    router.push(`/(stylist-detail)/${stylistId}`);
  };

  const handleCall = () => {
    if (salon?.phone) {
      Linking.openURL(`tel:${salon.phone}`);
    }
  };

  const renderStylistCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-zinc-800 rounded-2xl p-4 flex-row gap-3 items-center mb-3"
      onPress={() => handleStylistPress(item.id)}
      activeOpacity={0.95}
    >
      <View className="relative">
        {item.avatar_url ? (
          <Image
            source={{ uri: item.avatar_url }}
            className="w-14 h-14 rounded-xl"
          />
        ) : (
          <View className="w-14 h-14 rounded-xl bg-zinc-700 justify-center items-center">
            <Text className="text-base font-bold text-white">
              {item.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </Text>
          </View>
        )}
        {item.rating && (
          <View className="absolute -bottom-1 -right-1 bg-white rounded-lg px-1.5 py-0.5 flex-row items-center gap-0.5">
            <Ionicons name="star" size={9} color="#FCD34D" />
            <Text className="text-xs font-bold text-zinc-900">
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-white mb-0.5">
          {item.name}
        </Text>
        {item.specialties && item.specialties[0] && (
          <Text className="text-sm text-zinc-400 font-medium">
            {item.specialties[0]}
          </Text>
        )}
      </View>
      <TouchableOpacity
        className="w-10 h-10 bg-zinc-700 rounded-full justify-center items-center"
        onPress={() => {}}
      >
        <Ionicons name="chatbubble-outline" size={18} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-sm text-zinc-400 mt-4">Loading salon...</Text>
      </View>
    );
  }

  if (!salon) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center px-5">
        <View className="w-24 h-24 bg-zinc-800 rounded-full justify-center items-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        </View>
        <Text className="text-xl font-bold text-white mb-2">
          Salon not found
        </Text>
        <Text className="text-base text-zinc-400 text-center mb-6">
          This salon may no longer be available
        </Text>
        <TouchableOpacity
          className="bg-zinc-800 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: salon?.name || "",
          headerTintColor: "#ffffff",
          headerBackTitle: "Back",
        }}
      />
      <ScrollView
        className="flex-1 bg-zinc-900"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          {salon.cover_image ? (
            <Image
              source={{ uri: salon.cover_image }}
              className="w-full h-80"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-80 bg-blue-100 justify-center items-center">
              <Ionicons name="storefront" size={72} color="#93C5FD" />
            </View>
          )}

          <TouchableOpacity
            className="absolute top-16 left-5 w-11 h-11 bg-zinc-900/80 rounded-full justify-center items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>

          <View className="absolute top-16 right-5 flex-row gap-2">
            <TouchableOpacity className="w-11 h-11 bg-zinc-900/80 rounded-full justify-center items-center">
              <Ionicons name="share-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity className="w-11 h-11 bg-zinc-900/80 rounded-full justify-center items-center">
              <Ionicons name="heart-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 py-6 bg-zinc-900 rounded-t-3xl -mt-8">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-white mb-2">
                {salon.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="location" size={16} color="#ffffff" />
                <Text
                  className="text-sm text-zinc-400 flex-1"
                  numberOfLines={1}
                >
                  {salon.city || "Qatar"}
                </Text>
              </View>
            </View>
            {salon.rating && (
              <View className="bg-white rounded-2xl px-4 py-2.5">
                <View className="flex-row items-center gap-1 mb-0.5">
                  <Ionicons name="star" size={16} color="#FCD34D" />
                  <Text className="text-xl font-bold text-zinc-900">
                    {salon.rating.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-xs text-zinc-600 text-center">
                  ({salon.review_count || 0} review
                  {salon.review_count !== 1 ? "s" : ""})
                </Text>
              </View>
            )}
          </View>

          {salon.description && (
            <View className="mb-4">
              <Text className="text-base text-zinc-300 leading-6">
                {salon.description}
              </Text>
            </View>
          )}

          {salon.address && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-white mb-3">
                Location
              </Text>
              <TouchableOpacity
                className="bg-zinc-800 p-4 rounded-2xl flex-row items-center gap-3"
                onPress={() => {
                  const query = encodeURIComponent(salon.address);
                  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
                  Linking.openURL(url);
                }}
              >
                <View className="w-12 h-12 bg-zinc-700 rounded-full justify-center items-center">
                  <Ionicons name="location" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white mb-1">
                    Address
                  </Text>
                  <Text className="text-sm text-zinc-400">{salon.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}

          <View className="bg-zinc-800 rounded-2xl p-4 mb-4">
            <Text className="text-lg font-bold text-white mb-3">
              What we offer
            </Text>
            <View className="flex-row flex-wrap gap-4">
              <View className="items-center flex-1 min-w-[60px]">
                <View className="w-12 h-12 bg-zinc-700 rounded-xl justify-center items-center mb-2">
                  <Ionicons name="cut-outline" size={24} color="#ffffff" />
                </View>
                <Text className="text-xs text-zinc-400 text-center">
                  Haircut
                </Text>
              </View>
              <View className="items-center flex-1 min-w-[60px]">
                <View className="w-12 h-12 bg-zinc-700 rounded-xl justify-center items-center mb-2">
                  <Ionicons
                    name="color-palette-outline"
                    size={24}
                    color="#ffffff"
                  />
                </View>
                <Text className="text-xs text-zinc-400 text-center">
                  Coloring
                </Text>
              </View>
              <View className="items-center flex-1 min-w-[60px]">
                <View className="w-12 h-12 bg-zinc-700 rounded-xl justify-center items-center mb-2">
                  <Ionicons name="spa-outline" size={24} color="#ffffff" />
                </View>
                <Text className="text-xs text-zinc-400 text-center">Spa</Text>
              </View>
              <View className="items-center flex-1 min-w-[60px]">
                <View className="w-12 h-12 bg-zinc-700 rounded-xl justify-center items-center mb-2">
                  <Ionicons name="water-outline" size={24} color="#ffffff" />
                </View>
                <Text className="text-xs text-zinc-400 text-center">
                  Treatment
                </Text>
              </View>
            </View>
          </View>

          {salon.services && salon.services.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-white mb-3">
                Services & Pricing
              </Text>
              <View className="bg-zinc-800 rounded-2xl p-4">
                {salon.services.map((service: any, index: number) => (
                  <View
                    key={index}
                    className={`flex-row justify-between items-center py-3 ${
                      index < salon.services.length - 1
                        ? "border-b border-zinc-700"
                        : ""
                    }`}
                  >
                    <Text className="text-base text-white flex-1">
                      {service.name}
                    </Text>
                    {service.price && (
                      <Text className="text-lg font-bold text-white">
                        ${service.price}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {stylists.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-white mb-3">
                Hosted by Our Stylists
              </Text>
              <FlatList
                data={stylists}
                renderItem={renderStylistCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          <TouchableOpacity
            className="bg-white py-4 rounded-2xl flex-row justify-center items-center gap-2 mb-6"
            activeOpacity={0.9}
            onPress={() => setShowBookingDialog(true)}
          >
            <Text className="text-lg font-bold text-zinc-900">Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BookingDialog
        visible={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        salonId={salon?.id}
        salonName={salon?.name}
        servicePrice={selectedService?.price || 0}
        serviceName={selectedService?.name || "General Service"}
        serviceDuration={selectedService?.duration_minutes || 60}
      />
    </>
  );
}
