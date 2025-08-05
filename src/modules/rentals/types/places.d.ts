export interface Place {
  id: string;
  _id?: string;
  location_id: string;
  name: string;
  area: string;
}

export type CreatePlacePayload = Omit<Place, '_id'>;
export type UpdatePlacePayload = Partial<Omit<Place, '_id'>>;
