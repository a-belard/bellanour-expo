import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Salon {
  id: string;
  name: string;
  rating: number | null;
  review_count: number | null;
  address: string;
  city: string;
  state: string;
  cover_image: string | null;
  images: string[] | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  services: Array<{ name: string; price?: string }> | null;
}

interface SalonsState {
  salons: Salon[];
  isLoading: boolean;
  error: string | null;
  fetchSalons: () => Promise<void>;
}

export const useSalonsStore = create<SalonsState>((set) => ({
  salons: [],
  isLoading: false,
  error: null,

  fetchSalons: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("salons")
        .select(
          `
          id,
          name,
          rating,
          review_count,
          address,
          city,
          state,
          cover_image,
          images,
          phone,
          email,
          description,
          services (
            name,
            price
          )
        `
        )
        .limit(50);

      if (error) throw error;

      const formattedData: Salon[] = (data || []).map((salon: any) => ({
        id: salon.id,
        name: salon.name,
        rating: salon.rating,
        review_count: salon.review_count,
        address: salon.address || "",
        city: salon.city || "",
        state: salon.state || "",
        cover_image: salon.cover_image,
        images: salon.images,
        phone: salon.phone,
        email: salon.email,
        description: salon.description,
        services: salon.services || [],
      }));

      set({ salons: formattedData, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch salons",
        isLoading: false,
      });
    }
  },
}));
