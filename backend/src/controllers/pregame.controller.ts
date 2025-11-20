import { Response } from 'express';
import { PregameService } from '../services/pregame.service';
import { createPregameSchema, joinRequestSchema, approveDeclineSchema } from '../validators/pregame.validator';
import { AuthRequest } from '../middleware/auth';

const pregameService = new PregameService();

export class PregameController {
  async createPregame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = createPregameSchema.parse(req.body);
      const hostId = req.userId!;
      const pregame = await pregameService.createPregame(validatedData, hostId);

      res.status(201).json(pregame);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getPregamesByEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const eventId = req.params.eventId;
      const pregames = await pregameService.getPregamesByEvent(eventId);

      res.status(200).json(pregames);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async joinPregame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pregameId = req.params.id;
      const userId = req.userId!;
      const validatedData = joinRequestSchema.parse(req.body);
      const result = await pregameService.joinPregame(pregameId, userId, validatedData);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async requestToJoinPregame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pregameId = req.params.id;
      const userId = req.userId!;
      const validatedData = joinRequestSchema.parse(req.body);
      const result = await pregameService.requestToJoinPregame(pregameId, userId, validatedData);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getPregameHostInfo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pregameId = req.params.id;
      const userId = req.userId!;
      const info = await pregameService.getPregameHostInfo(pregameId, userId);

      res.status(200).json(info);
    } catch (error) {
      if (error instanceof Error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async approveJoinRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pregameId = req.params.id;
      const validatedData = approveDeclineSchema.parse(req.body);
      const hostId = req.userId!;
      const result = await pregameService.approveJoinRequest(
        validatedData.requestId,
        hostId
      );

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async declineJoinRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pregameId = req.params.id;
      const validatedData = approveDeclineSchema.parse(req.body);
      const hostId = req.userId!;
      const result = await pregameService.declineJoinRequest(
        validatedData.requestId,
        hostId
      );

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
