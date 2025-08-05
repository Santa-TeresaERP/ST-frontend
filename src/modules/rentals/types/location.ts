export interface Location {
  id: string;
  name: string;
  address: string;
  capacity: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  capacity: number;
  status: string;
}

export interface UpdateLocationRequest {
  name?: string;
  address?: string;
  capacity?: number;
  status?: string;
}
