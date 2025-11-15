export interface IncomeChurch {
  id: string;
  name: string;
  type: string;
  price: number;
  status: boolean;
  date: string;
  idChurch: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeDto {
  name: string;
  type: string;
  price: number;
  idChurch: string;
  date?: string;
}

export interface UpdateIncomeDto {
  name?: string;
  type?: string;
  price?: number;
  date?: string;
  status?: boolean;
}
