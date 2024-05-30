import { isValidObjectId } from "mongoose";
import { customError } from "../../utils";
import { TAcademicFaculty } from "./academicFaculty.interface";
import AcademicFaculty from "./academicFaculty.model";

// create a new academic faculty
const create = async (payload: TAcademicFaculty) => {
  const faculty = await findByProperty("name", payload.name);
  if (faculty) {
    throw customError(false, 400, "Academic Faculty already exists");
  }

  return AcademicFaculty.create(payload);
};

// get all academic facilities
const getAll = () => {
  return AcademicFaculty.find({});
};

// find academic faculty by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw customError(false, 400, "invalid faculty id");
    }
    return AcademicFaculty.findById(value);
  }
  return AcademicFaculty.findOne({ [key]: value });
};

// update academic faculty
const updateSingle = async (id: string, payload: TAcademicFaculty) => {
  if (!isValidObjectId(id)) {
    throw customError(false, 400, "invalid faculty id");
  }

  const faculty = await AcademicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!faculty) {
    throw customError(false, 404, "Academic Faculty not found");
  }

  return faculty;
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
};
