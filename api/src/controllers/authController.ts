import { Request, Response } from 'express';
import services from 'services/index';
import { handleError } from 'utils/errorHandler';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({
        message: 'Successfully registered!',
        user,
      });
    } catch (error) {
      return handleError(res, error, 'Error registering:');
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);

      res.cookie('authCookie', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({
        message: 'Successfully logged in!',
        token,
        user,
      });
    } catch (error) {
      return handleError(res, error, 'Error logging in:');
    }
  }
}
