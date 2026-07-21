import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
  imageUrl: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  trackStock: boolean;
  categoryId: string | null;
  category: ProductCategory | null;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: string;
  isActive: boolean;
  imageUrl?: string | null;
  categoryId?: string | null;
  lowStockThreshold?: number;
  trackStock?: boolean;
}

export type StockMovementType = "IN" | "OUT" | "ADJUSTMENT";

const KEYS = {
  products: ["products"] as const,
  categories: ["product-categories"] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: KEYS.products,
    queryFn: async () =>
      (await api.get<{ data: Product[] }>("/api/products")).data.data,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: KEYS.categories,
    queryFn: async () =>
      (await api.get<{ data: ProductCategory[] }>("/api/product-categories"))
        .data.data,
  });
}

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput & { id?: string }) => {
      const { id, ...body } = input;
      const res = id
        ? await api.put(`/api/products/${id}`, body)
        : await api.post("/api/products", body);
      return res.data.data as Product;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}

export function useToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      (await api.patch(`/api/products/${id}/status`, { isActive })).data
        .data as Product,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/products/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}

export function useRecordStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      type: StockMovementType;
      quantity: number;
      notes?: string;
    }) => {
      const { id, ...body } = input;
      return (await api.post(`/api/products/${id}/stock`, body)).data.data as {
        newStock: number;
      };
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}
