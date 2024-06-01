import { Router } from "express";
import academicDepartmentRoutes from "../modules/academic-department/academicDepartment.routes";
import academicFacultyRoutes from "../modules/academic-faculty/academicFaculty.routes";
import academicSemesterRoutes from "../modules/academic-semester/academicSemester.routes";
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
  {
    path: "/academic-semesters",
    routes: academicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    routes: academicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    routes: academicDepartmentRoutes,
  },
];

moduleRouts.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
