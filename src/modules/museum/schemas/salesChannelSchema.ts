import { z } from 'zod';

export const salesChannelSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
}); 