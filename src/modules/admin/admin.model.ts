import { Schema, model } from "mongoose";
import { BloodGroups } from "../faculty/faculty.constant";
import { Gender } from "./admin.constant";
import { TAdmin, TAdminModel, TUserName } from "./admin.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    maxlength: [20, "firstName can't be more than 20 characters"],
    trim: true,
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

const adminSchema = new Schema<TAdmin, TAdminModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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
      lowercase: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// filter out deleted documents
adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adminSchema.statics.isAdminExists = async function (
  key: string,
  value: string,
) {
  return await Admin.findOne({ [key]: value });
};

adminSchema.virtual("fullName").get(function () {
  return (
    this.name &&
    `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
  );
});

const Admin = model<TAdmin, TAdminModel>("Admin", adminSchema);
export default Admin;
