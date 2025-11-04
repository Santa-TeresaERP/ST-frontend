import api from "@/core/config/client";
import {
  Resource,
  CreateResourcePayload,
  UpdateResourcePayload,
} from "../types/resource";

export const fetchResources = async (): Promise<Resource[]> => {
  const response = await api.get<Resource[]>("/resource");
  return response.data;
};

export const getResource = async (id: string): Promise<Resource> => {
  const response = await api.get<Resource>(`/resource/${id}`);
  return response.data;
};

// action/resources.ts
export const createResource = async (payload: CreateResourcePayload) => {
  const body = {
    name: payload.name.trim(),
    observation: payload.observation ?? null, // 🔑 undefined -> null
  };

  const res = await api.post("/resource", body, {
    headers: { "Content-Type": "application/json" },
  });

  // según tu backend puede venir en data.resource o data
  return res.data.resource ?? res.data;
};

export const updateResource = async (
  id: string,
  payload: UpdateResourcePayload
): Promise<Resource> => {
  const response = await api.patch<Resource>(`/resource/${id}`, payload);
  return response.data;
};

export const deleteResource = async (id: string): Promise<void> => {
  await api.delete(`/resource/${id}`);
};
