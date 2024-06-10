import httpStatus from "http-status";
import mongoose, { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import academicSemesterService from "../academic-semester/academicSemester.service";
import OfferedCourse from "../offered-course/offeredCourse.model";
import { RegistrationStatus } from "./semesterRegistration.constant";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import SemesterRegistration from "./semesterRegistration.model";

// create
const create = async (payload: TSemesterRegistration) => {
  const academicSemesterId = payload.academicSemester;

  // check there is any registered semester that is already 'UPCOMING' | 'ONGOING'
  const isUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });
  if (isUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isUpcomingOrOngoingSemester.status} registered semester`,
    );
  }

  // check academic-semester is exist on the database collection
  const academicSemester = await academicSemesterService.findByProperty(
    "_id",
    academicSemesterId.toString(),
  );
  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }

  // checks the semester already registered with the academic-semester
  const isSemesterRegistered = await SemesterRegistration.findOne({
    academicSemester: academicSemesterId,
  });
  if (isSemesterRegistered) {
    throw new AppError(httpStatus.CONFLICT, "Semester already registered");
  }

  return SemesterRegistration.create(payload);
};

// get all
const getAll = (query: Record<string, unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  return semesterRegistrationQuery.modelQuery;
};

// get one
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return SemesterRegistration.findById(value).populate("academicSemester");
  } else {
    return SemesterRegistration.findOne({ [key]: value }).populate(
      "academicSemester",
    );
  }
};

// update
const updateSingle = async (id: string, payload: TSemesterRegistration) => {
  // check the semester registration exists on the database
  const isSemesterRegistrationExists = await findByProperty("_id", id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
  }

  // check the semester registration is ended
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedSemesterStatus = payload?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }

  // UPCOMING --> ONGOING --> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change the status ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change the status ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }

  // check current semester status and request semester status equal
  if (currentSemesterStatus === requestedSemesterStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The Semester status is already '${currentSemesterStatus}'`,
    );
  }

  return SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// delete
const deleteSingle = async (id: string) => {
  /**
   * Step1: Delete associated offered courses.
   * Step2: Delete registered semester when the status is 'UPCOMING'.
   **/

  // check the semester registration exists on the database
  const isSemesterRegistrationExists = await findByProperty("_id", id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
  }

  const semesterRegistrationStatus = isSemesterRegistrationExists?.status;
  if (semesterRegistrationStatus !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete as the registered semester is '${semesterRegistrationStatus}'`,
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedOfferedCourses = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      { session },
    );

    if (!deletedOfferedCourses) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete offered courses!",
      );
    }

    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete semester registration!",
      );
    }

    await session.commitTransaction();
    session.endSession();
    return deletedSemesterRegistration;
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
