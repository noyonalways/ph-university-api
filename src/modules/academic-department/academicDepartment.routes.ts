import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import academicDepartmentController from "./academicDepartment.controller";
import { updateAcademicDepartmentSchema } from "./academicDepartment.validation";

const router: Router = Router();

router
  .route("/")
  .post(auth(USER_ROLE.admin), academicDepartmentController.create)
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicDepartmentController.getAll,
  );

router
  .route("/:departmentId")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    academicDepartmentController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateAcademicDepartmentSchema),
    academicDepartmentController.updateSingle,
  );

export default router;
