import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export function sendResponse<T>(res: Response, obj: TResponse<T>) {
  res.status(obj.statusCode).json({
    success: obj.success,
    message: obj.message,
    data: obj.data,
  });
}
