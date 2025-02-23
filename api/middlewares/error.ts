import { Request, Response, NextFunction } from 'express';
import { AppError } from './customErrors';

const handleError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If the error is operational, it means it's something we expect and can handle
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  console.error(err);
  res.status(statusCode).json({
    error: message,
    status: 'fail',
  });
};

export default handleError;
