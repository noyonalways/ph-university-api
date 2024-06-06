import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import courseController from "./course.controller";
import { createCourseValidationSchema } from "./course.validation";

const router: Router = Router();

router
  .route("/")
  .get(courseController.getAll)
  .post(validateRequest(createCourseValidationSchema), courseController.create);

router
  .route("/:id")
  .get(courseController.getSingle)
  .patch(
    validateRequest(createCourseValidationSchema),
    courseController.updateSingle,
  )
  .delete(courseController.deleteSingle);

export default router;
