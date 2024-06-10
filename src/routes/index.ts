import { Router } from "express";
import academicDepartmentRoutes from "../modules/academic-department/academicDepartment.routes";
import academicFacultyRoutes from "../modules/academic-faculty/academicFaculty.routes";
import academicSemesterRoutes from "../modules/academic-semester/academicSemester.routes";
import adminRoutes from "../modules/admin/admin.routes";
import courseRoutes from "../modules/course/course.routes";
import facultyRoutes from "../modules/faculty/faculty.routes";
import offeredCourseRoutes from "../modules/offered-course/offeredCourse.routes";
import semesterRegistrationRoutes from "../modules/semester-registration/semesterRegistration.routes";
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
    path: "/faculties",
    routes: facultyRoutes,
  },
  {
    path: "/admins",
    routes: adminRoutes,
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
  {
    path: "/courses",
    routes: courseRoutes,
  },
  {
    path: "/semester-registrations",
    routes: semesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    routes: offeredCourseRoutes,
  },
];

moduleRouts.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
