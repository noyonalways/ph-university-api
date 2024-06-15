import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import offeredCourseController from "./offeredCourse.controller";
import {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
} from "./offeredCourse.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(createOfferedCourseValidationSchema),
    offeredCourseController.create,
  )
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    offeredCourseController.getAll,
  );

router
  .route("/:id")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    offeredCourseController.getSingle,
  )
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateOfferedCourseValidationSchema),
    offeredCourseController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), offeredCourseController.deleteSingle);

export default router;
