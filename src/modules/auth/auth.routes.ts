import { Router } from "express";
import validateRequest from "./../../middlewares/validateRequest";
import authController from "./auth.controller";
import { loginValidationSchema } from "./auth.validation";
const router: Router = Router();

router
  .route("/login")
  .post(validateRequest(loginValidationSchema), authController.login);

export default router;
