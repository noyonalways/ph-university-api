import { TAcademicSemester } from "./academicSemester.interface";
import AcademicSemester from "./academicSemester.model";

const create = (payload: TAcademicSemester) => {
  return AcademicSemester.create(payload);
};

export default {
  create,
};
