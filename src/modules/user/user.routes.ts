import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createStudentValidationSchema } from "../student/student.validation";
import userController from "./user.controller";

const router: Router = Router();

router.post(
  "/create-student",
  validateRequest(createStudentValidationSchema),
  userController.create,
);

export default router;
