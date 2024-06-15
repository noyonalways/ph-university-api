import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "./../../middlewares/auth";
import adminController from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";

const router: Router = Router();

router.route("/").get(auth(USER_ROLE.admin), adminController.getAll);

router
  .route("/:id")
  .get(auth(USER_ROLE.admin), adminController.getSingle)
  .patch(
    auth(USER_ROLE.admin),
    validateRequest(updateAdminValidationSchema),
    adminController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), adminController.deleteSingle);

export default router;
