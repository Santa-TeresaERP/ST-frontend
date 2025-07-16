// Exportaciones principales del módulo de tiendas

// Types
export type { 
  StoreAttributes, 
  CreateStorePayload, 
  UpdateStorePayload,
  StoreResponse,
  SingleStoreResponse 
} from "./types/store";

// Schemas
export { 
  createStoreSchema, 
  updateStoreSchema,
  type CreateStoreFormData,
  type UpdateStoreFormData 
} from "./schemas/store-schema";

// Actions
export {
  fetchStores,
  fetchStoreById,
  createStore,
  updateStore,
  deleteStore
} from "./action/store-actions";

// Hooks
export {
  useFetchStores,
  useFetchStoreById,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
  STORE_QUERY_KEYS
} from "./hook/useStores";

// Components
export { default as StoreListView } from "./components/store-list-view";
export { default as ModalCreateStore } from "./components/store/modal-create-store";
export { default as ModalEditStore } from "./components/store/modal-edit-store";
export { default as ModalViewStore } from "./components/store/modal-view-store";
export { default as ModalDeleteStore } from "./components/store/modal-delete-store";
