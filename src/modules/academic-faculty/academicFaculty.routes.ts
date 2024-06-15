import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import academicFacultyController from "./academicFaculty.controller";
import academicFacultySchema from "./academicFaculty.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(academicFacultySchema),
    academicFacultyController.create,
  )
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicFacultyController.getAll,
  );

router
  .route("/:facultyId")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicFacultyController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(academicFacultySchema),
    academicFacultyController.updateSingle,
  );

export default router;
