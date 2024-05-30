import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import academicFacultyController from "./academicFaculty.controller";
import academicFacultySchema from "./academicFaculty.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(academicFacultySchema),
    academicFacultyController.create,
  )
  .get(academicFacultyController.getAll);

router
  .route("/:facultyId")
  .get(academicFacultyController.getSingle)
  .patch(
    validateRequest(academicFacultySchema),
    academicFacultyController.updateSingle,
  );

export default router;
