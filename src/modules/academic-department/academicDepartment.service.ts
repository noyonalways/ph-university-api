import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import academicFacultyService from "../academic-faculty/academicFaculty.service";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AcademicDepartment from "./academicDepartment.model";

// create a new academic department
const create = async (payload: TAcademicDepartment) => {
  const academicFaculty = await academicFacultyService.findByProperty(
    "_id",
    payload.academicFaculty.toString(),
  );

  if (!academicFaculty) {
    throw new AppError(httpStatus.BAD_REQUEST, "Academic Faculty not found");
  }

  return AcademicDepartment.create(payload);
};

// get all academic departments
const getAll = (query: Record<string, unknown>) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find({}).populate("academicFaculty"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  return academicDepartmentQuery.modelQuery;
};

// find academic department by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "invalid academic department id",
      );
    }
    return AcademicDepartment.findById(value).populate("academicFaculty");
  }
  return AcademicDepartment.findOne({ [key]: value });
};

// update academic department
const updateSingle = async (id: string, payload: TAcademicDepartment) => {
  if (!isValidObjectId(id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "invalid academic department id",
    );
  }

  if (payload.academicFaculty) {
    const academicFaculty = await academicFacultyService.findByProperty(
      "_id",
      payload.academicFaculty.toString(),
    );

    if (!academicFaculty) {
      throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty not found");
    }
  }

  // check anything changed before updating
  const currentAcademicDepartment = await findByProperty("_id", id);
  if (
    currentAcademicDepartment?.name === payload.name ||
    currentAcademicDepartment?.academicFaculty === payload.academicFaculty
  ) {
    throw new AppError(
      httpStatus.NOT_MODIFIED,
      "Academic Department already exists",
    );
  }

  const updatedAcademicDepartment = await AcademicDepartment.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    },
  );

  return updatedAcademicDepartment;
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
};
