export interface Entrance {
  id?: string;
  user_id: string;
  type_person_id: string;
  sale_date: string;
  sale_number: string;
  sale_channel: string;
  total_sale: number;
  payment_method: string;
  free: boolean;
  // Objetos relacionados que devuelve la API
  user?: {
    id: string;
    name: string;
    phonenumber: string;
    dni: string;
    email: string;
  };
  type_person?: {
    id: string;
    name: string;
    base_price: number;
  };
  sales_channel?: {
    id: string;
    name: string;
  };
  payment_method_obj?: {
    id: string;
    name: string;
  };
}

export type EntrancePayload = Omit<Entrance, 'id' | 'user' | 'type_person' | 'sales_channel' | 'payment_method_obj'>; 