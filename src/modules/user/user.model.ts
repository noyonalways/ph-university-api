import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

const User = model<IUser>("User", userSchema);
export default User;
