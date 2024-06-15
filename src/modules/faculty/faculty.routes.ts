import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "./../../middlewares/auth";
import facultyController from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";

const router: Router = Router();

router
  .route("/")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    facultyController.getAll,
  );

router
  .route("/:id")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    facultyController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.faculty),
    validateRequest(updateFacultyValidationSchema),
    facultyController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), facultyController.deleteSingle);

export default router;
