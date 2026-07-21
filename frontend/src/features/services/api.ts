import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ServiceCategory {
  id: string;
  name: string;
  capacity: number;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  currency: string;
  minDepositFixed: string;
  maxBookingsPerDay: number | null;
  latestBookingTime: string | null;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: string | null;
  category: ServiceCategory | null;
}

export interface ServiceInput {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: string;
  minDepositFixed?: string;
  maxBookingsPerDay?: number | null;
  latestBookingTime?: string | null;
  isActive: boolean;
  imageUrl?: string | null;
  categoryId?: string | null;
}

const KEYS = {
  services: ["services"] as const,
  categories: ["service-categories"] as const,
};

export function useServices() {
  return useQuery({
    queryKey: KEYS.services,
    queryFn: async () =>
      (await api.get<{ data: Service[] }>("/api/services")).data.data,
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: KEYS.categories,
    queryFn: async () =>
      (await api.get<{ data: ServiceCategory[] }>("/api/service-categories"))
        .data.data,
  });
}

export function useSaveService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInput & { id?: string }) => {
      const { id, ...body } = input;
      const res = id
        ? await api.put(`/api/services/${id}`, body)
        : await api.post("/api/services", body);
      return res.data.data as Service;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.services }),
  });
}

export function useToggleService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      (await api.patch(`/api/services/${id}/status`, { isActive })).data
        .data as Service,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.services }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/services/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.services }),
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; name: string; capacity: number }) => {
      const { id, ...body } = input;
      const res = id
        ? await api.put(`/api/service-categories/${id}`, body)
        : await api.post("/api/service-categories", body);
      return res.data.data as ServiceCategory;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEYS.categories }),
  });
}
