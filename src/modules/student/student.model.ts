import { Schema, model } from "mongoose";
import {
  IGuardian,
  ILocalGuardian,
  IStudent,
  IStudentModel,
  IUserName,
} from "./student.interface";

const userNameSchema = new Schema<IUserName>({
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

const guardianSchema = new Schema<IGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<ILocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<IStudent, IStudentModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user id is required"],
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    guardian: guardianSchema,
    localGuardian: {
      type: localGuardianSchema,
      required: true,
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

// mongoose pre query middleware
studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// mongoose custom instance method create
// studentSchema.methods.isUserExists = async function (email: string) {
//   const existingUser = await Student.findOne({ email });
//   return existingUser;
// };

// mongoose custom static method create
studentSchema.statics.isUserExists = async function (email: string) {
  const existingUser = await Student.findOne({ email });
  return existingUser;
};

// mongoose virtual method create
// in options object we can pass virtuals:true to get virtual properties in json
studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

const Student = model<IStudent, IStudentModel>("Student", studentSchema);
export default Student;
