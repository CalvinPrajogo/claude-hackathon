import { Router } from 'express';
import { PregameController } from '../controllers/pregame.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const pregameController = new PregameController();

router.post('/', authenticate, (req, res) => pregameController.createPregame(req, res));
router.get('/event/:eventId', authenticate, (req, res) => pregameController.getPregamesByEvent(req, res));
router.post('/:id/join', authenticate, (req, res) => pregameController.joinPregame(req, res));
router.post('/:id/request', authenticate, (req, res) => pregameController.requestToJoinPregame(req, res));
router.get('/:id/host', authenticate, (req, res) => pregameController.getPregameHostInfo(req, res));
router.post('/:id/approve', authenticate, (req, res) => pregameController.approveJoinRequest(req, res));
router.post('/:id/decline', authenticate, (req, res) => pregameController.declineJoinRequest(req, res));

export default router;
