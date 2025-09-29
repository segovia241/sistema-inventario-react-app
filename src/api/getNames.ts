import type { Product } from "../types/Product";

const API_URL = import.meta.env.VITE_API_URL;

// Función síncrona que usa datos locales
export const getCategoryName = (categoryId: number | null, categories: any[] = []): string => {
  if (!categoryId) return "Sin categoría";
  
  const category = categories.find(cat => cat.id === categoryId);
  return category?.nombre || "Desconocida";
};

// Función síncrona que usa datos locales  
export const getBrandName = (brandId: number | null, brands: any[] = []): string => {
  if (!brandId) return "Sin marca";
  
  const brand = brands.find(br => br.id === brandId);
  return brand?.nombre || "Desconocida";
};

export const getStockStatus = (product: Product) => {
  if (product.stock_actual === 0) return { status: "out-of-stock", label: "Sin stock", color: "red" }
  if (product.stock_actual <= product.stock_minimo) return { status: "low-stock", label: "Stock bajo", color: "yellow" }
  return { status: "in-stock", label: "En stock", color: "green" }
}

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categoria`);
  return res.ok ? await res.json() : [];
};

export const getBrands = async () => {
  const res = await fetch(`${API_URL}/marca`);
  return res.ok ? await res.json() : [];
};