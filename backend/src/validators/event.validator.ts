import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime('Invalid date format'),
  location: z.string().min(1, 'Location is required'),
  vibeTags: z.array(z.string()).default([]),
  description: z.string().optional(),
  category: z.enum(['Party', 'Bar/Club', 'Game', 'Concert', 'House Event']).default('Party'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
