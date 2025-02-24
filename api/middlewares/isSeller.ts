import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from 'types/UserRequest';

export const isSeller = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
): void => {
  const isSeller = req.user && req.user.seller;
  if (!isSeller) {
    res.status(403).json({ error: 'User is not a seller' });
    return;
  }
  next();
};
