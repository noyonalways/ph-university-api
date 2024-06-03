import httpStatus from "http-status";
import mongoose, { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { studentSearchableFields } from "./student.constant";
import { IStudent } from "./student.interface";
import Student from "./student.model";

const getAll = (query: Record<string, unknown>) => {
  /* const queryObj = { ...query };

  const studentSearchableFields = [
    "email",
    "name.firstName",
    "name.middleName",
    "presentAddress",
  ];
  let searchTerm: string = "";

  if (query.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  // filtering
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  excludeFields.forEach((item) => delete queryObj[item]);
  console.log({ query }, { queryObj });

  const filterQuery = searchQuery
    .find(queryObj)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  let sort = "-createdAt";
  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 5;
  let skip = 0;

  if (query.limit) {
    limit = parseInt(query.limit as string);
  }

  if (query.page) {
    page = parseInt(query.page as string);
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  // field limiting
  let fields = "-__v";

  // fields: 'name,email';
  // fields: 'name email';

  if (query.fields) {
    fields = (query.fields as string).split(",").join(" ");
  }

  const fieldsQuery = limitQuery.select(fields);
  return fieldsQuery; */

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  return studentQuery.modelQuery;
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid productId");
    }
    return Student.findById(value)
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      });
  } else {
    return Student.findOne({ [key]: value })
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      });
  }
};

// update student
const updateSingle = async (id: string, payload: IStudent) => {
  if (!(await Student.isStudentExists("id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "student not found");
  }

  // destructure the non-primitive data
  const { name, guardian, localGuardian, ...remainingData } = payload;

  const modifiedObj: Record<string, unknown> = {
    ...remainingData,
  };

  // name
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedObj[`name.${key}`] = value;
    }
  }
  // guardian
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedObj[`guardian.${key}`] = value;
    }
  }
  // local guardian
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedObj[`localGuardian.${key}`] = value;
    }
  }

  const result = Student.findOneAndUpdate({ id }, modifiedObj, {
    new: true,
    runValidators: true,
  });

  return result;
};

// delete soft single student
const deleteSingle = async (id: string) => {
  if (!(await Student.isStudentExists("id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "student not found");
  }

  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // transaction-1
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    // transaction-2
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    // about transaction and end session
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
  }
};

export default {
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
