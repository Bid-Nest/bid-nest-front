import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from './customErrors';

const someRouteHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const someCondition = false;
    if (!someCondition) {
      throw new NotFoundError('The resource was not found');
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    // Pass errors to the global error handler
    next(error);
  }
};
