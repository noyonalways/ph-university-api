import { Request, Response, Router } from "express";
import studentRoutes from "../modules/student/student.routes";
import userRoutes from "../modules/user/user.routes";
import { globalErrorHandler, notFoundErrorHandler } from "./error.handler";
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

// not found error handler
router.use(notFoundErrorHandler);

// global error handler
router.use(globalErrorHandler);

export default router;
