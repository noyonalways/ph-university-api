import { Schema, model } from "mongoose";
import { BloodGroups, Gender } from "./faculty.constant";
import { IFacultyModel, TFaculty, TUserName } from "./faculty.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    maxlength: [20, "firstName can't be more than 20 characters"],
    trim: true,
    validate: {
      validator: function (value: string) {
        const capitalizedName =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return capitalizedName === value;
      },
      message: "{VALUE} is not in capitalize format",
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "lastName can't be more than 20 characters"],
  },
});

const facultySchema = new Schema<TFaculty, IFacultyModel>({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "User id is required"],
    unique: true,
    ref: "User",
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
  },
  name: {
    type: userNameSchema,
    required: [true, "Name is required"],
  },
  gender: {
    type: String,
    enum: {
      values: Gender,
      message: "{VALUE} is not a valid gender",
    },
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  contactNo: {
    type: String,
    required: [true, "Contact No is required"],
  },
  emergencyContactNo: {
    type: String,
    required: [true, "Emergency Contact No is required"],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: BloodGroups,
      message: "{VALUE} is not a valid blood group",
    },
  },
  presentAddress: {
    type: String,
    required: [true, "Present address is required"],
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required"],
  },
  profileImage: {
    type: String,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: "AcademicDepartment",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// filter out deleted documents
facultySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

facultySchema.statics.isFacultyExists = async function (
  key: string,
  value: string,
) {
  return await Faculty.findOne({ [key]: value });
};

const Faculty = model<TFaculty, IFacultyModel>("Faculty", facultySchema);
export default Faculty;
