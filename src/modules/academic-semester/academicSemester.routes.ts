import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import academicSemesterController from "./academicSemester.controller";
import {
  academicSemesterSchema,
  updateAcademicSemesterSchema,
} from "./academicSemester.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(academicSemesterSchema),
    academicSemesterController.create,
  )
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicSemesterController.getAll,
  );

router
  .route("/:semesterId")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicSemesterController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateAcademicSemesterSchema),
    academicSemesterController.updateSingle,
  );

export default router;
