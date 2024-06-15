import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import studentController from "./student.controller";
import { updateStudentValidationSchema } from "./student.validation";

const router: Router = Router();

router
  .route("/")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    studentController.getAll,
  );

router
  .route("/:id")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    studentController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.student),
    validateRequest(updateStudentValidationSchema),
    studentController.updateSingle,
  )
  .delete(
    auth(USER_ROLE.admin, USER_ROLE.student),
    studentController.deleteSingle,
  );

export default router;
