import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import academicDepartmentController from "./academicDepartment.controller";
import { updateAcademicDepartmentSchema } from "./academicDepartment.validation";

const router: Router = Router();

router
  .route("/")
  .post(academicDepartmentController.create)
  .get(academicDepartmentController.getAll);

router
  .route("/:departmentId")
  .get(academicDepartmentController.getSingle)
  .patch(
    validateRequest(updateAcademicDepartmentSchema),
    academicDepartmentController.updateSingle,
  );

export default router;
// validateRequest(createAcademicDepartmentSchema),
