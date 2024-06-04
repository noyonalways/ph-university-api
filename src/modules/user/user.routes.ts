import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createAdminValidationSchema } from "../admin/admin.validation";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createStudentValidationSchema } from "../student/student.validation";
import userController from "./user.controller";

const router: Router = Router();

router.post(
  "/create-student",
  validateRequest(createStudentValidationSchema),
  userController.createStudent,
);

router.post(
  "/create-faculty",
  validateRequest(createFacultyValidationSchema),
  userController.createFaculty,
);

router.post(
  "/create-admin",
  validateRequest(createAdminValidationSchema),
  userController.createAdmin,
);

export default router;
