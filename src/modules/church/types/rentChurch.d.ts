export interface RentChurch {
  id: string;
  name: string;
  type: 'matrimonio' | 'bautizo' | 'otros';
  startTime: string;
  endTime: string;
  price: number;
  status: boolean;
  date: string;
  idChurch: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRentChurchPayload {
  name: string;
  type: 'matrimonio' | 'bautizo' | 'otros';
  startTime: string;
  endTime: string;
  price: number;
  date: string;
  idChurch: string;
  status?: boolean;
}

export interface UpdateRentChurchPayload {
  name?: string;
  type?: 'matrimonio' | 'bautizo' | 'otros';
  startTime?: string;
  endTime?: string;
  price?: number;
  date?: string;
  idChurch?: string;
  status?: boolean;
}
