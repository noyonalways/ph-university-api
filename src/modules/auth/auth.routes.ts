import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "./../../middlewares/validateRequest";
import authController from "./auth.controller";
import {
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  resetPasswordValidationSchema,
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

router
  .route("/refresh-token")
  .post(
    validateRequest(refreshTokenValidationSchema),
    authController.refreshToken,
  );

router
  .route("/forget-password")
  .post(
    validateRequest(forgetPasswordValidationSchema),
    authController.forgotPassword,
  );

router
  .route("/reset-password")
  .post(
    validateRequest(resetPasswordValidationSchema),
    authController.resetPassword,
  );

export default router;
