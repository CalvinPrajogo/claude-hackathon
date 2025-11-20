import { Response } from 'express';
import { MutualService } from '../services/mutual.service';
import { AuthRequest } from '../middleware/auth';

const mutualService = new MutualService();

export class MutualController {
  async getMutualsInEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const currentUserId = req.userId!;
      const eventId = req.params.eventId;
      const mutuals = await mutualService.getMutualsInEvent(currentUserId, eventId);

      res.status(200).json(mutuals);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getMutualsInPregame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const currentUserId = req.userId!;
      const pregameId = req.params.pregameId;
      const mutuals = await mutualService.getMutualsInPregame(currentUserId, pregameId);

      res.status(200).json(mutuals);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
