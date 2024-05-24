import { Router } from "express";
import userController from "./user.controller";

const router: Router = Router();

router.post("/create-student", userController.create);

export default router;
