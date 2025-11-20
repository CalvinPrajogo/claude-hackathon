import { z } from 'zod';

export const createPregameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  meetingTime: z.string().datetime('Invalid meeting time format'),
  meetingLocation: z.string().min(1, 'Meeting location is required'),
  accessType: z.enum(['OPEN', 'REQUEST_ONLY']).default('OPEN'),
  capacity: z.number().int().positive().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  requirements: z.string().optional(),
  eventId: z.string().min(1, 'Event ID is required'),
});

export const joinRequestSchema = z.object({
  bringing: z.array(z.string()).default([]),
  groupSize: z.number().int().positive().default(1),
  message: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const approveDeclineSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
});

export type CreatePregameInput = z.infer<typeof createPregameSchema>;
export type JoinRequestInput = z.infer<typeof joinRequestSchema>;
export type ApproveDeclineInput = z.infer<typeof approveDeclineSchema>;
