import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import academicSemesterController from "./academicSemester.controller";
import academicSemesterSchema from "./academicSemester.validation";

const router: Router = Router();

router.post(
  "/",
  validateRequest(academicSemesterSchema),
  academicSemesterController.create,
);

export default router;
