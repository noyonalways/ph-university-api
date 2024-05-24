import { Router } from "express";
import studentController from "./student.controller";

const router: Router = Router();

router
  .route("/students")
  .post(studentController.create)
  .get(studentController.getAll);

router
  .route("/students/:studentId")
  .get(studentController.getSingle)
  .delete(studentController.deleteSingle);

export default router;
