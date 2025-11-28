import { z } from 'zod'
import { churchSchema } from '../schemas/churchValidation'

export type Church = z.infer<typeof churchSchema>

export interface ChurchAttributes {
  id: string
  name: string
  location: string
  state: boolean
  status: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateChurchPayload extends Omit<Church, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

export interface UpdateChurchPayload extends Partial<Omit<Church, 'id' | 'createdAt' | 'updatedAt' | 'status'>> {}
