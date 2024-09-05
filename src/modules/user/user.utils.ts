import { TAcademicSemester } from "../academic-semester/academicSemester.interface";
import User from "./user.model";

/* 
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
    .sort({})
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
}; */

export const generateStudentId = async (payload: TAcademicSemester) => {
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  // Check for existing student IDs with the same semester code and year
  const existingStudentIds = await User.find(
    {
      role: "student",
      id: { $regex: `^${currentYear}${currentSemesterCode}` },
    },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  const existingIds = existingStudentIds.map((student) => student.id);
  const maxId =
    existingIds.length > 0
      ? Math.max(...existingIds.map((id) => parseInt(id.substring(6))))
      : 0;

  let incrementId = (maxId + 1).toString().padStart(4, "0");

  incrementId = `${currentYear}${currentSemesterCode}${incrementId}`;

  return incrementId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: "faculty",
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

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementalId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementalId = `F-${incrementalId}`;
  return incrementalId;
};

// Admin Id
export const findLastAdminId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: "admin",
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

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementalId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementalId = `A-${incrementalId}`;
  return incrementalId;
};
