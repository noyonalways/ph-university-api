import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import facultyController from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";

const router: Router = Router();

router.route("/").get(facultyController.getAll);

router
  .route("/:id")
  .get(facultyController.getSingle)
  .patch(
    validateRequest(updateFacultyValidationSchema),
    facultyController.updateSingle,
  )
  .delete(facultyController.deleteSingle);

export default router;