import { NextFunction, Request, Response } from "express";
import { TCustomError } from "../types";

export const notFoundErrorHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const err: TCustomError = new Error("Route not found");
  err.success = false;
  err.status = 404;
  next(err);
};

export const globalErrorHandler = (
  error: TCustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  return res.status(error.status || 500).json({
    success: error.success,
    message: error.message || "something went wrong",
  });
};
