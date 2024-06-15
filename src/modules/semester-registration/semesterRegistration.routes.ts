import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "./../../middlewares/validateRequest";
import semesterRegistrationController from "./semesterRegistration.controller";
import {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
} from "./semesterRegistration.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(createSemesterRegistrationValidationSchema),
    semesterRegistrationController.create,
  )
  .get(auth(USER_ROLE.admin), semesterRegistrationController.getAll);

router
  .route("/:id")
  .get(auth(USER_ROLE.admin), semesterRegistrationController.getSingle)
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateSemesterRegistrationValidationSchema),
    semesterRegistrationController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), semesterRegistrationController.deleteSingle);

export default router;
