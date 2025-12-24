import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookingsStore } from "@/stores/bookingsStore";

interface BookingDialogProps {
  visible: boolean;
  onClose: () => void;
  salonId: string;
  salonName: string;
  stylistId?: string;
  stylistName?: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  serviceDuration?: number;
}

export default function BookingDialog({
  visible,
  onClose,
  salonId,
  salonName,
  stylistId,
  stylistName,
  serviceId,
  serviceName = "General Service",
  servicePrice = 0,
  serviceDuration = 60,
}: BookingDialogProps) {
  const { createBooking } = useBookingsStore();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available dates (next 30 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Missing Information", "Please select both date and time");
      return;
    }

    setIsSubmitting(true);

    const result = await createBooking({
      salon_id: salonId,
      stylist_id: stylistId || null,
      service_id: serviceId || null,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      duration_minutes: serviceDuration,
      service_name: serviceName,
      service_price: servicePrice,
      notes: notes || null,
    });

    setIsSubmitting(false);

    if (result.success) {
      Alert.alert(
        "Booking Confirmed!",
        `Your appointment at ${salonName} has been booked for ${formatDate(
          new Date(selectedDate)
        )} at ${selectedTime}`,
        [{ text: "OK", onPress: onClose }]
      );
    } else {
      Alert.alert("Booking Failed", result.error || "Please try again");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-zinc-900 rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
            <Text className="text-xl font-bold text-white">
              Book Appointment
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Salon Info */}
            <View className="bg-zinc-800 rounded-2xl p-4 mb-6">
              <Text className="text-lg font-bold text-white mb-1">
                {salonName}
              </Text>
              {stylistName && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="person" size={14} color="#a1a1aa" />
                  <Text className="text-sm text-zinc-400">{stylistName}</Text>
                </View>
              )}
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-zinc-700">
                <Text className="text-sm text-zinc-400">{serviceName}</Text>
                <Text className="text-lg font-bold text-white">
                  ${servicePrice}
                </Text>
              </View>
            </View>

            {/* Select Date */}
            <View className="mb-6">
              <Text className="text-base font-bold text-white mb-3">
                Select Date
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {generateDates().map((date) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const isSelected = selectedDate === dateStr;
                    return (
                      <TouchableOpacity
                        key={dateStr}
                        className={`px-4 py-3 rounded-xl min-w-[100px] items-center ${
                          isSelected ? "bg-white" : "bg-zinc-800"
                        }`}
                        onPress={() => setSelectedDate(dateStr)}
                      >
                        <Text
                          className={`text-xs font-medium mb-1 ${
                            isSelected ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </Text>
                        <Text
                          className={`text-lg font-bold ${
                            isSelected ? "text-zinc-900" : "text-white"
                          }`}
                        >
                          {date.getDate()}
                        </Text>
                        <Text
                          className={`text-xs ${
                            isSelected ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Select Time */}
            <View className="mb-6">
              <Text className="text-base font-bold text-white mb-3">
                Select Time
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {generateTimeSlots().map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      className={`px-4 py-2.5 rounded-xl ${
                        isSelected ? "bg-white" : "bg-zinc-800"
                      }`}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? "text-zinc-900" : "text-white"
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Notes */}
            <View className="mb-6">
              <Text className="text-base font-bold text-white mb-3">
                Additional Notes (Optional)
              </Text>
              <TextInput
                className="bg-zinc-800 rounded-xl px-4 py-3 text-white"
                placeholder="Any special requests or notes..."
                placeholderTextColor="#71717a"
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`py-4 rounded-2xl items-center ${
                isSubmitting ? "bg-zinc-700" : "bg-white"
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-lg font-bold text-zinc-900">
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
