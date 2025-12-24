import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useBookingsStore } from "@/stores/bookingsStore";

type BookingStatus = "upcoming" | "completed" | "cancelled";

export default function BookingsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<BookingStatus>("upcoming");
  const { bookings, isLoading, fetchBookings, cancelBooking } =
    useBookingsStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusFromBooking = (status: string): BookingStatus => {
    if (status === "completed") return "completed";
    if (status === "cancelled" || status === "no_show") return "cancelled";
    return "upcoming";
  };

  const filteredBookings = bookings.filter(
    (booking) => getStatusFromBooking(booking.status) === selectedTab
  );

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const result = await cancelBooking(
              bookingId,
              "Cancelled by customer"
            );
            if (result.success) {
              Alert.alert("Success", "Booking cancelled successfully");
            } else {
              Alert.alert("Error", result.error || "Failed to cancel booking");
            }
          },
        },
      ]
    );
  };

  const renderBookingCard = (booking: any) => {
    const statusDisplay = getStatusFromBooking(booking.status);

    return (
      <TouchableOpacity
        key={booking.id}
        className="bg-zinc-800 rounded-2xl overflow-hidden mb-4"
        activeOpacity={0.7}
      >
        <View className="flex-row">
          <Image
            source={{
              uri:
                booking.salon?.cover_image || "https://via.placeholder.com/150",
            }}
            className="w-24 h-full"
            resizeMode="cover"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-base font-bold text-white mb-1">
                  {booking.salon?.name || "Salon"}
                </Text>
                {booking.stylist && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="person" size={12} color="#a1a1aa" />
                    <Text className="text-sm text-zinc-400">
                      {booking.stylist.name}
                    </Text>
                  </View>
                )}
              </View>
              <View
                className={`${getStatusColor(
                  statusDisplay
                )} px-3 py-1 rounded-full`}
              >
                <Text className="text-xs font-semibold text-white capitalize">
                  {booking.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1 mb-2">
              <Ionicons name="cut" size={12} color="#a1a1aa" />
              <Text className="text-sm text-zinc-300">
                {booking.service_name}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar-outline" size={14} color="#a1a1aa" />
                  <Text className="text-xs text-zinc-400">
                    {formatDate(booking.appointment_date)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={14} color="#a1a1aa" />
                  <Text className="text-xs text-zinc-400">
                    {booking.appointment_time}
                  </Text>
                </View>
              </View>
              <Text className="text-base font-bold text-white">
                ${booking.service_price}
              </Text>
            </View>
          </View>
        </View>

        {statusDisplay === "upcoming" && (
          <View className="flex-row border-t border-zinc-700">
            <TouchableOpacity
              className="flex-1 py-3 items-center border-r border-zinc-700"
              onPress={() => handleCancelBooking(booking.id)}
            >
              <Text className="text-sm font-semibold text-red-400">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 py-3 items-center">
              <Text className="text-sm font-semibold text-white">
                Reschedule
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {statusDisplay === "completed" && (
          <TouchableOpacity
            className="py-3 items-center border-t border-zinc-700"
            onPress={() => router.push(`/(salon-detail)/${booking.salon_id}`)}
          >
            <Text className="text-sm font-semibold text-white">Book Again</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-sm text-zinc-400 mt-4">Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-5 pt-12 pb-6">
          <Text className="text-3xl font-bold text-white mb-6">
            My Bookings
          </Text>

          {/* Tab Selector */}
          <View className="flex-row bg-zinc-800 rounded-2xl p-1 mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                selectedTab === "upcoming" ? "bg-white" : ""
              }`}
              onPress={() => setSelectedTab("upcoming")}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  selectedTab === "upcoming" ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                selectedTab === "completed" ? "bg-white" : ""
              }`}
              onPress={() => setSelectedTab("completed")}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  selectedTab === "completed"
                    ? "text-zinc-900"
                    : "text-zinc-400"
                }`}
              >
                Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                selectedTab === "cancelled" ? "bg-white" : ""
              }`}
              onPress={() => setSelectedTab("cancelled")}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  selectedTab === "cancelled"
                    ? "text-zinc-900"
                    : "text-zinc-400"
                }`}
              >
                Cancelled
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            filteredBookings.map(renderBookingCard)
          ) : (
            <View className="items-center justify-center py-16">
              <View className="w-24 h-24 bg-zinc-800 rounded-full items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={40} color="#71717a" />
              </View>
              <Text className="text-xl font-bold text-white mb-2">
                No {selectedTab} bookings
              </Text>
              <Text className="text-sm text-zinc-400 text-center mb-6 px-8">
                {selectedTab === "upcoming"
                  ? "You don't have any upcoming appointments"
                  : selectedTab === "completed"
                  ? "You haven't completed any appointments yet"
                  : "No cancelled bookings"}
              </Text>
              <TouchableOpacity
                className="bg-white px-6 py-3 rounded-xl"
                onPress={() => router.push("/(tabs)/")}
              >
                <Text className="text-sm font-semibold text-zinc-900">
                  Book Now
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
