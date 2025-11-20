import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { createEventSchema } from '../validators/event.validator';
import { AuthRequest } from '../middleware/auth';

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createEventSchema.parse(req.body);
      const event = await eventService.createEvent(validatedData);

      res.status(201).json(event);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTodayEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await eventService.getTodayEvents();
      res.status(200).json(events);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getEventById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const eventId = req.params.eventId;
      const currentUserId = req.userId;
      const event = await eventService.getEventById(eventId, currentUserId);

      res.status(200).json(event);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
