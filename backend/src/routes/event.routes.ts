import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

router.post('/', authenticate, (req, res) => eventController.createEvent(req, res));
router.get('/today', (req, res) => eventController.getTodayEvents(req, res));
router.get('/:eventId', authenticate, (req, res) => eventController.getEventById(req, res));

export default router;
