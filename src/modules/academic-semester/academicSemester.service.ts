import { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
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
    throw new AppError(400, "Invalid Semester Code");
  }

  return AcademicSemester.create(payload);
};

// get all semester from db
const getAll = (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(
    AcademicSemester.find({}),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  return academicSemesterQuery.modelQuery;
};

// get semester by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(400, "invalid semester id");
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
    throw new AppError(400, "Invalid Semester Code");
  }

  return AcademicSemester.findByIdAndUpdate(id, payload, { new: true });
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
};
