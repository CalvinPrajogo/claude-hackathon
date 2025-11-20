import { Router } from 'express';
import { MutualController } from '../controllers/mutual.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const mutualController = new MutualController();

router.get('/event/:eventId', authenticate, (req, res) => mutualController.getMutualsInEvent(req, res));
router.get('/pregame/:pregameId', authenticate, (req, res) => mutualController.getMutualsInPregame(req, res));

export default router;
