import { NextFunction, Request, Response, Router } from "express";
import studentRoutes from "../modules/student/student.routes";
import userRoutes from "../modules/user/user.routes";
import { TCustomError } from "../types";
const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// main routes
router.use("/api/v1/students", studentRoutes);
router.use("/api/v1/users", userRoutes);

router.use((_req: Request, _res: Response, next: NextFunction) => {
  const err: TCustomError = new Error("Page not found");
  err.status = 404;
  next(err);
});

router.use(
  (
    error: TCustomError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    res.status(error.status || 500).json({
      status: false,
      message: error.message || "something went wrong",
    });
  },
);

export default router;
