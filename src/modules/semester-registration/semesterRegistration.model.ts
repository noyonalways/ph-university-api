import { Schema, model } from "mongoose";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";
import { TSemesterRegistration } from "./semesterRegistration.interface";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: "AcademicSemester",
    unique: true,
    required: [true, "academic semester is required"],
  },
  status: {
    type: String,
    enum: {
      values: SemesterRegistrationStatus,
    },
    default: "UPCOMING",
    required: [true, "status is required"],
  },
  startDate: {
    type: Date,
    required: [true, "start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "end date is required"],
  },
  minCredit: {
    type: Number,
    required: [true, "min credit is required"],
  },
  maxCredit: {
    type: Number,
    required: [true, "max credit is required"],
  },
});

const SemesterRegistration = model<TSemesterRegistration>(
  "Semester-Registration",
  semesterRegistrationSchema,
);

export default SemesterRegistration;
