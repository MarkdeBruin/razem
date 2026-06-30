import * as z from 'zod';

export const newUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.enum(['owner', 'partner']),
});

export const userSchema = newUserSchema.extend({
  id: z.string(),
});

export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;