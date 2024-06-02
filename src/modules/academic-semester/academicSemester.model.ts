import { Schema, model } from "mongoose";
import AppError from "../../errors/AppError";
import {
  AcademicSemesterCodes,
  AcademicSemesterNames,
  Months,
} from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterNames,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCodes,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre("save", async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExists) {
    throw new AppError(400, "Semester already exists");
  }

  next();
});

const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema,
);

export default AcademicSemester;
