import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import enrolledCourseController from "./enrolledCourse.controller";
import {
  enrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
} from "./enrolledCourse.validation";
const router: Router = Router();

// enroll a new course -> "/create-enrolled-course"
router.post(
  "/",
  auth(USER_ROLE.student),
  validateRequest(enrolledCourseValidationSchema),
  enrolledCourseController.createEnrolledCourse,
);

// update enrolled course marks
router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty),
  validateRequest(updateEnrolledCourseMarksValidationSchema),
  enrolledCourseController.updateEnrolledCourseMarks,
);

export default router;
