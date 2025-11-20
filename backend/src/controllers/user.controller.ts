import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { signupSchema, loginSchema } from '../validators/user.validator';
import { AuthRequest } from '../middleware/auth';

const userService = new UserService();

export class UserController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await userService.signup(validatedData);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await userService.login(validatedData);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
