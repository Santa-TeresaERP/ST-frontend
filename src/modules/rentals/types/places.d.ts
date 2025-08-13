export interface Place {
  id: string;
  name: string;
  area: string;
  location_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePlacePayload = Omit<Place, 'id'>;
export type UpdatePlacePayload = Partial<Omit<Place, 'id'>>;
