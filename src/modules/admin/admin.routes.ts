import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import adminController from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";

const router: Router = Router();

router.route("/").get(adminController.getAll);

router
  .route("/:id")
  .get(adminController.getSingle)
  .patch(
    validateRequest(updateAdminValidationSchema),
    adminController.updateSingle,
  )
  .delete(adminController.deleteSingle);

export default router;
