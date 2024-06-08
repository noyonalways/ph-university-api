import { Router } from "express";
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
    validateRequest(createSemesterRegistrationValidationSchema),
    semesterRegistrationController.create,
  )
  .get(semesterRegistrationController.getAll);

router
  .route("/:id")
  .get(semesterRegistrationController.getSingle)
  .patch(
    validateRequest(updateSemesterRegistrationValidationSchema),
    semesterRegistrationController.updateSingle,
  );

export default router;
