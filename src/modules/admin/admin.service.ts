import httpStatus from "http-status";
import mongoose, { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { AdminSearchableFields } from "./admin.constant";
import { TAdmin } from "./admin.interface";
import Admin from "./admin.model";

const getAll = (query: Record<string, unknown>) => {
  const AdminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  return AdminQuery.modelQuery;
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return Admin.findById(value);
  } else {
    return Admin.findOne({ [key]: value });
  }
};

// update faculty
const updateSingle = async (id: string, payload: TAdmin) => {
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

  const result = Admin.findByIdAndUpdate(id, modifiedObj, {
    new: true,
    runValidators: true,
  });

  return result;
};

// delete soft single student
const deleteSingle = async (id: string) => {
  if (!(await findByProperty("_id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }

  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // transaction-1
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Admin");
    }

    // transaction-2
    const deletedUser = await User.findByIdAndUpdate(
      deletedAdmin.user,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err) {
    // about transaction and end session
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Admin");
  }
};

export default {
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
