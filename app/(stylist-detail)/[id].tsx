import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import BookingDialog from "@/components/BookingDialog";

export default function StylistDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [stylist, setStylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStylistData();
    }
  }, [id]);

  const fetchStylistData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("stylists")
        .select(
          `
          *,
          salon:salons(name, city, address, phone)
        `
        )
        .eq("id", id as string)
        .single();

      if (error) throw error;
      setStylist(data);

      // Services are not connected to stylists in current schema
      // TODO: Implement stylist_services junction table if needed
    } catch (error) {
      console.error("Error fetching stylist data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    setShowBookingDialog(true);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-sm text-zinc-400 mt-4">Loading stylist...</Text>
      </View>
    );
  }

  if (!stylist) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center px-5">
        <View className="w-24 h-24 bg-zinc-800 rounded-full justify-center items-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        </View>
        <Text className="text-xl font-bold text-white mb-2">
          Stylist not found
        </Text>
        <Text className="text-base text-zinc-400 text-center mb-6">
          This stylist may no longer be available
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
          headerTitle: "",
          headerTintColor: "#ffffff",
          headerBackTitle: "Back",
        }}
      />
      <ScrollView
        className="flex-1 bg-zinc-900"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <View className="bg-zinc-800 h-64 absolute top-0 left-0 right-0" />

          <View className="items-center pt-20 pb-6">
            {stylist.avatar_url ? (
              <Image
                source={{ uri: stylist.avatar_url }}
                className="w-40 h-40 rounded-full border-4 border-white shadow-2xl"
              />
            ) : (
              <View className="w-40 h-40 rounded-full bg-zinc-700 justify-center items-center border-4 border-white shadow-2xl">
                <Text className="text-5xl font-bold text-white">
                  {stylist.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </Text>
              </View>
            )}

            <Text className="text-3xl font-bold text-white mt-4 mb-2">
              {stylist.name}
            </Text>

            {stylist.salon && (
              <TouchableOpacity className="flex-row items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-full mb-3">
                <Ionicons name="storefront" size={14} color="#ffffff" />
                <Text className="text-sm font-medium text-white">
                  {stylist.salon.name}
                </Text>
              </TouchableOpacity>
            )}

            {stylist.rating && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={18} color="#FBBF24" />
                <Text className="text-lg font-bold text-white">
                  {stylist.rating.toFixed(1)}
                </Text>
                <Text className="text-sm text-zinc-400 ml-1">
                  ({stylist.review_count || 0} reviews)
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-5 mt-4">
          {stylist.specialties && stylist.specialties.length > 0 && (
            <View className="bg-zinc-800 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="cut" size={20} color="#ffffff" />
                <Text className="text-lg font-bold text-white">
                  Specialties
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {stylist.specialties.map((specialty: string, index: number) => (
                  <View
                    key={index}
                    className="bg-zinc-700 px-4 py-2.5 rounded-xl"
                  >
                    <Text className="text-sm font-medium text-white">
                      {specialty}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {stylist.bio && (
            <View className="bg-zinc-800 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="person" size={20} color="#ffffff" />
                <Text className="text-lg font-bold text-white">About</Text>
              </View>
              <Text className="text-base text-zinc-300 leading-6">
                {stylist.bio}
              </Text>
            </View>
          )}

          {stylist.years_experience && (
            <View className="bg-zinc-800 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-zinc-700 rounded-full justify-center items-center">
                  <Ionicons name="briefcase" size={22} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-zinc-400 mb-1">Experience</Text>
                  <Text className="text-lg font-bold text-white">
                    {stylist.years_experience} years
                  </Text>
                </View>
              </View>
            </View>
          )}

          {stylist.salon && (stylist.salon.phone || stylist.salon.address) && (
            <View className="bg-zinc-800 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="location" size={20} color="#ffffff" />
                <Text className="text-lg font-bold text-white">
                  Salon Location
                </Text>
              </View>

              {stylist.salon.phone && (
                <TouchableOpacity
                  className="flex-row items-center gap-3 mb-3 bg-zinc-700 p-4 rounded-xl active:bg-zinc-600"
                  onPress={() => Linking.openURL(`tel:${stylist.salon.phone}`)}
                  activeOpacity={0.7}
                >
                  <View className="w-11 h-11 bg-white rounded-full justify-center items-center">
                    <Ionicons name="call" size={20} color="#18181b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-zinc-400 uppercase mb-1">
                      Phone
                    </Text>
                    <Text className="text-base text-white font-medium">
                      {stylist.salon.phone}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#71717a" />
                </TouchableOpacity>
              )}

              {stylist.salon.address && (
                <View className="flex-row items-center gap-3 bg-zinc-700 p-4 rounded-xl">
                  <View className="w-11 h-11 bg-white rounded-full justify-center items-center">
                    <Ionicons name="location" size={20} color="#18181b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-zinc-400 uppercase mb-1">
                      Address
                    </Text>
                    <Text className="text-base text-white">
                      {stylist.salon.address}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            onPress={handleBooking}
            activeOpacity={0.8}
            className="mb-8"
          >
            <View className="bg-white py-5 rounded-2xl flex-row justify-center items-center gap-3 shadow-lg">
              <Ionicons name="calendar" size={24} color="#18181b" />
              <Text className="text-lg font-bold text-zinc-900">
                Book Appointment
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BookingDialog
        visible={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        salonId={stylist?.salon_id || ""}
        salonName={stylist?.salon?.name || "Salon"}
        stylistId={stylist?.id}
        stylistName={stylist?.name}
      />
    </>
  );
}
