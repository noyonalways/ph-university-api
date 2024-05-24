import { Router } from "express";
import studentController from "./student.controller";

const router: Router = Router();

router.route("/").get(studentController.getAll);

router
  .route("/:id")
  .get(studentController.getSingle)
  .delete(studentController.deleteSingle);

export default router;
