import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createAdminValidationSchema } from "../admin/admin.validation";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createStudentValidationSchema } from "../student/student.validation";
import { USER_ROLE } from "./user.constant";
import userController from "./user.controller";

const router: Router = Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  userController.createStudent,
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  userController.createFaculty,
);

router.post(
  "/create-admin",
  validateRequest(createAdminValidationSchema),
  userController.createAdmin,
);

export default router;
