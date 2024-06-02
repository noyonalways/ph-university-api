import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import studentController from "./student.controller";
import { updateStudentValidationSchema } from "./student.validation";

const router: Router = Router();

router.route("/").get(studentController.getAll);

router
  .route("/:id")
  .get(studentController.getSingle)
  .patch(
    validateRequest(updateStudentValidationSchema),
    studentController.updateSingle,
  )
  .delete(studentController.deleteSingle);

export default router;
