import { Response } from "express";
import { TCustomError } from "../types";
export function customError(
  success: boolean = false,
  status: number = 500,
  message: string = "something went wrong",
) {
  const err: TCustomError = new Error(message);
  err.status = status;
  err.success = success;
  return err;
}

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
