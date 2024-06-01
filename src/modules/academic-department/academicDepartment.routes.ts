import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import academicDepartmentController from "./academicDepartment.controller";
import {
  createAcademicDepartmentSchema,
  updateAcademicDepartmentSchema,
} from "./academicDepartment.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(createAcademicDepartmentSchema),
    academicDepartmentController.create,
  )
  .get(academicDepartmentController.getAll);

router
  .route("/:departmentId")
  .get(academicDepartmentController.getSingle)
  .patch(
    validateRequest(updateAcademicDepartmentSchema),
    academicDepartmentController.updateSingle,
  );

export default router;
