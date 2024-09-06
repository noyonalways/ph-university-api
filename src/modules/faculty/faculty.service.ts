import httpStatus from "http-status";
import mongoose, { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { FacultySearchableFields } from "./faculty.constant";
import { TFaculty } from "./faculty.interface";
import Faculty from "./faculty.model";

const getAll = (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find()
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      })
      .populate("user"),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  return facultyQuery.modelQuery;
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return Faculty.findById(value)
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      })
      .populate("user");
  } else {
    return Faculty.findOne({ [key]: value }).populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  }
};

// update faculty
const updateSingle = async (id: string, payload: TFaculty) => {
  if (!(await findByProperty("_id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "faculty not found");
  }

  // destructure the non-primitive data
  const { name, ...remainingData } = payload || {};

  const modifiedObj: Record<string, unknown> = {
    ...remainingData,
  };

  // modify the name
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedObj[`name.${key}`] = value;
    }
  }

  const result = Faculty.findByIdAndUpdate(id, modifiedObj, {
    new: true,
    runValidators: true,
  });

  return result;
};

// delete soft single student
const deleteSingle = async (id: string) => {
  if (!(await findByProperty("_id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "faculty not found");
  }

  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // transaction-1
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty");
    }

    // transaction-2
    const deletedUser = await User.findByIdAndUpdate(
      deletedFaculty.user,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (err) {
    // about transaction and end session
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty");
  }
};

export default {
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
