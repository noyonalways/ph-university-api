import httpStatus from "http-status";
import { Schema, model } from "mongoose";
import { customError } from "../../utils";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, "academic faculty id is required"],
      ref: "AcademicFaculty",
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre("save", async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw customError(
      false,
      httpStatus.BAD_REQUEST,
      "Department already exists",
    );
  }

  next();
});

academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();

  const isDepartmentExist = await AcademicDepartment.findById(query);
  if (!isDepartmentExist) {
    throw customError(
      false,
      httpStatus.NOT_FOUND,
      "Academic Department not found",
    );
  }

  next();
});

const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema,
);

export default AcademicDepartment;
