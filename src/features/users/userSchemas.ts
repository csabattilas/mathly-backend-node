import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  firebase_uid: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
});

export const userCreateSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  name: z.string().min(1, { message: 'Name cannot be empty' }).optional(),
});

export const userUpdateSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  name: z.string().min(1, { message: 'Name cannot be empty' }).optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
