// types/customer.ts
export interface Customer {
  id: string
  full_name: string
  dni: number
  phone: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  full_name: string
  dni: number
  phone: string
  email: string
}

export interface UpdateCustomerRequest {
  full_name?: string
  dni?: number
  phone?: string
  email?: string
}

export interface CustomerResponse {
  success: boolean
  data?: Customer | Customer[]
  message: string
  error?: string
}
