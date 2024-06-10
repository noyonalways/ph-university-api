import { Schema, model } from "mongoose";
import { Days } from "./offeredCourse.constant";
import { TOfferedCourse } from "./offeredCourse.interface";

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: "Semester-Registration",
      required: [true, "semester registration id is required"],
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "Academic-Semester",
      required: [true, "academic semester id is required"],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "Academic-Faculty",
      required: [true, "academic faculty id is required"],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "Academic-Department",
      required: [true, "academic department id is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "course id is required"],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: [true, "faculty id is required"],
    },
    maxCapacity: {
      type: Number,
      required: [true, "max capacity is required"],
    },
    section: {
      type: Number,
      required: [true, "section is required"],
    },
    days: [
      {
        type: String,
        enum: {
          values: Days,
          message: "The {VALUE} is not valid",
        },
      },
    ],
    startTime: {
      type: String,
      required: [true, "start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "end time is required"],
    },
  },
  {
    timestamps: true,
  },
);

const OfferedCourse = model<TOfferedCourse>(
  "Offered-Course",
  offeredCourseSchema,
);

export default OfferedCourse;
