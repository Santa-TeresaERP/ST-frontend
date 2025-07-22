import { create } from 'zustand';
import { StoreAttributes } from '@/modules/sales/types/store.d';

interface StoreState {
  selectedStore: StoreAttributes | null;
  setSelectedStore: (store: StoreAttributes | null) => void;
  clearSelectedStore: () => void;
}

export const useStoreState = create<StoreState>((set) => ({
  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
  clearSelectedStore: () => set({ selectedStore: null }),
}));
