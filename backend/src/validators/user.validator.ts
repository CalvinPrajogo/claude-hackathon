import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior']),
  major: z.string().min(1, 'Major is required'),
  dorm: z.string().min(1, 'Dorm is required'),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
