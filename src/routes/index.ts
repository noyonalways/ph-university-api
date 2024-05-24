import { Router } from "express";
import studentRoutes from "../modules/student/student.routes";
import userRoutes from "../modules/user/user.routes";

const router: Router = Router();

const moduleRouts = [
  {
    path: "/users",
    routes: userRoutes,
  },
  {
    path: "/students",
    routes: studentRoutes,
  },
];

moduleRouts.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
