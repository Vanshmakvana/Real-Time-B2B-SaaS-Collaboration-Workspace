import { Request, Response, NextFunction } from 'express';

export interface CustomResponse extends Response {
  success: (data: any, message?: string, statusCode?: number) => void;
  error: (message: string, statusCode?: number, errors?: any) => void;
}

export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  const customRes = res as CustomResponse;

  customRes.success = (data: any, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  customRes.error = (message: string, statusCode = 500, errors = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };

  next();
};
