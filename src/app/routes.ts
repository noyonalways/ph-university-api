import { Request, Response, Router } from "express";
import { globalErrorHandler, notFoundErrorHandler } from "./error.handler";
import allRoutes from "../routes/index";
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
router.use("/api/v1", allRoutes);

// not found error handler
router.use(notFoundErrorHandler);

// global error handler
router.use(globalErrorHandler);

export default router;
