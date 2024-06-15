import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import courseController from "./course.controller";
import {
  courseFacultyValidationSchema,
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from "./course.validation";

const router: Router = Router();

router
  .route("/")
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    courseController.getAll,
  )
  .post(
    auth(USER_ROLE.admin),
    validateRequest(createCourseValidationSchema),
    courseController.create,
  );

router
  .route("/:id")
  .get(courseController.getSingle)
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateCourseValidationSchema),
    courseController.updateSingle,
  )
  .delete(courseController.deleteSingle);

// assign faculties to the course
router.put(
  "/:courseId/assign-faculties",
  auth(USER_ROLE.admin),
  validateRequest(courseFacultyValidationSchema),
  courseController.assignFacultiesWithCourse,
);

router.delete(
  "/:courseId/remove-faculties",
  auth(USER_ROLE.admin),
  validateRequest(courseFacultyValidationSchema),
  courseController.removeFacultiesFromCourse,
);

export default router;
