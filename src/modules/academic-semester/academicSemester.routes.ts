import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import academicSemesterController from "./academicSemester.controller";
import academicSemesterSchema from "./academicSemester.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(academicSemesterSchema),
    academicSemesterController.create,
  )
  .get(academicSemesterController.getAll);

router
  .route("/:semesterId")
  .get(academicSemesterController.getSingle)
  .patch(academicSemesterController.updateSingle);

export default router;
