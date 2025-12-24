import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Stylist {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[] | null;
  avatar_url: string | null;
  rating: number | null;
  review_count: number | null;
  years_experience: number | null;
  salon_id: string | null;
  is_active: boolean;
  salon?: {
    name: string;
    city: string | null;
  };
}

interface StylistsState {
  stylists: Stylist[];
  isLoading: boolean;
  error: string | null;
  fetchIndependentStylists: () => Promise<void>;
  fetchStylistsByLocation: (salonId: string) => Promise<Stylist[]>;
}

export const useStylistsStore = create<StylistsState>((set) => ({
  stylists: [],
  isLoading: false,
  error: null,

  fetchIndependentStylists: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching all stylists...");
      const { data, error } = await supabase
        .from("stylists")
        .select(
          `
          *,
          salon:salons(name, city)
        `
        )
        .eq("is_active", true)
        .limit(100);

      if (error) {
        console.error("Error fetching stylists:", error);
        throw error;
      }

      console.log("Fetched stylists:", data?.length || 0);
      set({ stylists: data || [], isLoading: false });
    } catch (error) {
      console.error("Fetch stylists error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch stylists",
        isLoading: false,
      });
    }
  },

  fetchStylistsByLocation: async (salonId: string) => {
    try {
      const { data, error } = await supabase
        .from("stylists")
        .select("*")
        .eq("salon_id", salonId)
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching stylists:", error);
      return [];
    }
  },
}));
