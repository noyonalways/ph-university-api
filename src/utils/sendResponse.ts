import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    limit?: number;
    total?: number;
    page?: number;
    totalPages?: number;
  };
  data: T;
};

export function sendResponse<T>(res: Response, obj: TResponse<T>) {
  res.status(obj.statusCode).json({
    success: obj.success,
    message: obj.message,
    meta: obj.meta,
    data: obj.data,
  });
}
