import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be at least 8 characters"],
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "student", "faculty"],
        message: "{VALUE} is not a valid role",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["in-progress", "blocked"],
        message: "{VALUE} is not a valid status",
      },
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// mongoose pre middleware for hashing the password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.salt_rounds));
  next();
});

// remove the password from the saved response
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

const User = model<IUser>("User", userSchema);
export default User;
