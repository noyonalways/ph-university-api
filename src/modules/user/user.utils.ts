import { TAcademicSemester } from "../academic-semester/academicSemester.interface";
import User from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: "student",
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000

  let currentId = (0).toString(); // by default 0000

  const lastStudentId = await findLastStudentId(); // 2030 01 0001

  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentYear = payload.year;
  const currentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentYear === currentYear &&
    lastStudentSemesterCode === currentSemesterCode
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  let incrementalId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementalId = `${payload.year}${payload.code}${incrementalId}`;
  return incrementalId;
};

export default generateStudentId;
