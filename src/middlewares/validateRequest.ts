import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // validation check
      await schema.parseAsync({ body: req.body });

      // if everything all right then next()  ->
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
