import { Response } from 'express';

export const JsonApiResponse = (
  res: Response,
  message: string,
  success: boolean,
  data: any,
  statusCode: number
) => {
  res.status(statusCode).json({
    message,
    success,
    data,
  });
};

export const DefaultJsonResponse = (
  message: string,
  data: any,
  success?: boolean
) => {
  return {
    message,
    data,
    success,
  };
};
