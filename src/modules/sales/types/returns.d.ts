export interface returnsAttributes {
  id?: string
  productId: string
  salesId: string
  reason: string
  observations: string
  quantity: number
  price?: number // <- lo marcas como opcional
  createdAt?: Date
  updatedAt?: Date
}
