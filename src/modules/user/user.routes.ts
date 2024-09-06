import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import upload from "../../utils/upload";
import { createAdminValidationSchema } from "../admin/admin.validation";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createStudentValidationSchema } from "../student/student.validation";
import { USER_ROLE } from "./user.constant";
import userController from "./user.controller";
import { changeStatusValidationSchema } from "./user.validation";

const router: Router = Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  // multer will parse the file and form-data
  upload.single("file"),
  // parse the form-data text to json
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createStudentValidationSchema),
  userController.createStudent,
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  // multer will parse the file and form-data
  upload.single("file"),
  // parse the form-data text to json
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  userController.createFaculty,
);

router.post(
  "/create-admin",
  auth(USER_ROLE.admin),
  // multer will parse the file and form-data
  upload.single("file"),
  // parse the form-data text to json
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  userController.createAdmin,
);

router.post(
  "/change-status/:id",
  auth(USER_ROLE.admin),
  validateRequest(changeStatusValidationSchema),
  userController.changeStatus,
);

router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userController.getMe,
);

export default router;
