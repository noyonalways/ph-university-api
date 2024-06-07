import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import courseController from "./course.controller";
import {
  courseFacultyValidationSchema,
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from "./course.validation";

const router: Router = Router();

router
  .route("/")
  .get(courseController.getAll)
  .post(validateRequest(createCourseValidationSchema), courseController.create);

router
  .route("/:id")
  .get(courseController.getSingle)
  .patch(
    validateRequest(updateCourseValidationSchema),
    courseController.updateSingle,
  )
  .delete(courseController.deleteSingle);

// assign faculties to the course
router.put(
  "/:courseId/assign-faculties",
  validateRequest(courseFacultyValidationSchema),
  courseController.assignFacultiesWithCourse,
);

router.delete(
  "/:courseId/remove-faculties",
  validateRequest(courseFacultyValidationSchema),
  courseController.removeFacultiesFromCourse,
);

export default router;
