import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "./../../middlewares/validateRequest";
import authController from "./auth.controller";
import {
  changePasswordValidationSchema,
  loginValidationSchema,
} from "./auth.validation";
const router: Router = Router();

router
  .route("/login")
  .post(validateRequest(loginValidationSchema), authController.login);

router
  .route("/change-password")
  .post(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(changePasswordValidationSchema),
    authController.changePassword,
  );

export default router;
