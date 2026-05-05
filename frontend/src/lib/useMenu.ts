import { useEffect, useState } from "react";
import { api } from "./api";

export type MenuProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
};

export type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  products: MenuProduct[];
};

type MenuResponse = { status: "ok"; count?: number; categories: MenuCategory[] };

export function useMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<MenuResponse>("/api/v1/menu")
      .then((r) => {
        if (!cancelled) setCategories(Array.isArray(r?.categories) ? r.categories : []);
      })
      .catch(() => { /* keep empty */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}

export function formatPrice(price: number | string, currency: string): string {
  const n = typeof price === "number" ? price : Number(price);
  const safe = Number.isFinite(n) ? n : 0;
  if (currency === "TRY") return `${safe.toFixed(2)} ₺`;
  return `${safe.toFixed(2)} ${currency}`;
}
