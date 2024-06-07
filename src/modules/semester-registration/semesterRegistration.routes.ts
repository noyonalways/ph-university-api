import { Router } from "express";
import validateRequest from "./../../middlewares/validateRequest";
import semesterRegistrationController from "./semesterRegistration.controller";
import { createSemesterRegistrationValidationSchema } from "./semesterRegistration.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(createSemesterRegistrationValidationSchema),
    semesterRegistrationController.create,
  )
  .get(semesterRegistrationController.getAll);

export default router;
