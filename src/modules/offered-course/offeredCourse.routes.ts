import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import offeredCourseController from "./offeredCourse.controller";
import {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
} from "./offeredCourse.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(createOfferedCourseValidationSchema),
    offeredCourseController.create,
  )
  .get(offeredCourseController.getAll);

router
  .route("/:id")
  .get(offeredCourseController.getSingle)
  .patch(
    validateRequest(updateOfferedCourseValidationSchema),
    offeredCourseController.updateSingle,
  )
  .delete(offeredCourseController.deleteSingle);

export default router;
