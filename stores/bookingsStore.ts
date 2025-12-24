import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Booking {
  id: string;
  customer_id: string;
  salon_id: string;
  stylist_id: string | null;
  service_id: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  service_name: string;
  service_price: number;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  salon?: {
    name: string;
    address: string;
    cover_image: string;
  };
  stylist?: {
    name: string;
    avatar_url: string;
  };
}

interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  createBooking: (
    booking: Partial<Booking>
  ) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (
    bookingId: string,
    reason: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateBooking: (
    bookingId: string,
    updates: Partial<Booking>
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          salon:salons(name, address, cover_image),
          stylist:stylists(name, avatar_url)
        `
        )
        .eq("customer_id", user.id)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false });

      if (error) throw error;

      set({ bookings: data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  createBooking: async (booking) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            ...booking,
            customer_id: user.id,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Refresh bookings
      await get().fetchBookings();

      return { success: true };
    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      };
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) throw error;

      // Refresh bookings
      await get().fetchBookings();

      return { success: true };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to cancel booking",
      };
    }
  },

  updateBooking: async (bookingId, updates) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId);

      if (error) throw error;

      // Refresh bookings
      await get().fetchBookings();

      return { success: true };
    } catch (error) {
      console.error("Error updating booking:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update booking",
      };
    }
  },
}));
