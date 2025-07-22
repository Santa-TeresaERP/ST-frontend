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
}

export type EntrancePayload = Omit<Entrance, 'id'>; 