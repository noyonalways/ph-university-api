import { customError } from "../../utils";
import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import AcademicSemester from "./academicSemester.model";

const create = (payload: TAcademicSemester) => {
  /**
   * Autumn: 01
   * Summer: 02
   * Fall: 03
   */

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw customError(false, 400, "Invalid academic semester");
  }

  return AcademicSemester.create(payload);
};

export default {
  create,
};
