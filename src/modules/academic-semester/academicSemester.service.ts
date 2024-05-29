import { isValidObjectId } from "mongoose";
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
    throw customError(false, 400, "Invalid Semester Code");
  }

  return AcademicSemester.create(payload);
};

// get all semester from db
const getAll = () => {
  return AcademicSemester.find({});
};

// get semester by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw customError(false, 400, "invalid semester id");
    }
    return AcademicSemester.findById(value);
  }
  return AcademicSemester.findOne({ [key]: value });
};

// update semester by id
const updateSingle = (id: string, payload: TAcademicSemester) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw customError(false, 400, "Invalid Semester Code");
  }

  return AcademicSemester.findByIdAndUpdate(id, payload, { new: true });
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
};
