import { z } from 'zod';

// Schema for user creation from client
export const userCreateSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  name: z.string().min(1, { message: 'Name cannot be empty' }).optional(),
});

// Type derived from schema
export type UserCreate = z.infer<typeof userCreateSchema>;
