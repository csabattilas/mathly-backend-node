import { z } from 'zod'

export const firebaseAuthSchema = z.object({
  idToken: z.string({ required_error: 'Firebase ID token is required' }),
})

export type FirebaseAuth = z.infer<typeof firebaseAuthSchema>
